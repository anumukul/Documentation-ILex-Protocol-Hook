export default function ILexReactiveDoc() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>ILexReactive.sol</h1>
      <p>
        The Reactive Smart Contract (RSC) deployed on the Reactive Network
        Lasna testnet. It subscribes to ILexHook events on Unichain Sepolia,
        monitors impermanent loss for all registered LPs, and fires cross-chain
        callbacks when thresholds are breached or price recovers.
      </p>

      <h2>Event Subscriptions</h2>
      <p>
        The RSC subscribes to five event topics from the ILexHook contract on
        the origin chain (Unichain Sepolia, Chain 1301):
      </p>
      <pre>{`// In constructor + subscribeAll():
service.subscribe(originChainId, hookAddress, POSITION_CREATED_TOPIC, ...);
service.subscribe(originChainId, hookAddress, POSITION_EXITED_TOPIC, ...);
service.subscribe(originChainId, hookAddress, POSITION_REENTERED_TOPIC, ...);
service.subscribe(originChainId, hookAddress, MANUAL_EXIT_TOPIC, ...);
service.subscribe(originChainId, hookAddress, PRICE_UPDATE_TOPIC, ...);`}</pre>

      <h2>react() — Event Handler</h2>
      <p>
        The entry point for event processing. Called by the Reactive Network
        inside the ReactVM whenever a subscribed event is detected on the
        origin chain.
      </p>
      <pre>{`function react(LogRecord calldata log) external vmOnly {
    if (log.topic_0 == POSITION_CREATED_TOPIC)
        _handlePositionCreated(log);
    else if (log.topic_0 == PRICE_UPDATE_TOPIC)
        _handlePriceUpdate(log);
    else if (log.topic_0 == POSITION_EXITED_TOPIC)
        _handlePositionExited(log);
    else if (log.topic_0 == POSITION_REENTERED_TOPIC)
        _handlePositionReentered(log);
    else if (log.topic_0 == MANUAL_EXIT_TOPIC)
        _handleManualExit(log);
}`}</pre>

      <h2>IL Monitoring Logic</h2>
      <p>
        On every <code>PriceUpdate</code> event:
      </p>
      <ul>
        <li>
          For each <strong>ACTIVE</strong> LP: calculate IL using the
          <code>_calculateIL()</code> function. If IL ≥ threshold, emit a
          <code>Callback</code> to <code>triggerExit()</code> and set status
          to <code>EXITING</code> (prevents double triggers).
        </li>
        <li>
          For each <strong>EXITED</strong> LP: calculate price deviation using
          <code>_priceDeviation()</code>. If deviation ≤ reentry tolerance and
          cooldown has passed, emit a <code>Callback</code> to
          <code>triggerReentry()</code>.
        </li>
      </ul>

      <h2>Callback Mechanism</h2>
      <pre>{`bytes memory payload = abi.encodeWithSignature(
    "triggerExit(address,address)",
    address(0),  // replaced by RVM ID
    lp
);
emit Callback(destinationChainId, hookAddress, GAS_LIMIT, payload);`}</pre>
      <p>
        The Reactive Network reads the <code>Callback</code> event and submits
        a transaction to the destination chain via the Callback Proxy. The first
        160 bits of the payload are automatically replaced with the deployer&apos;s
        address (the RVM ID).
      </p>

      <h2>IL Calculation</h2>
      <pre>{`// IL = |2r/(1+r²) - 1| where r = sqrt(currentPrice/entryPrice)
// Returns basis points (500 = 5%)
function _calculateIL(uint160 entry, uint160 current)
    internal pure returns (uint256 ilBps) {
    uint256 Q96 = 2**96;
    uint256 rQ96 = (uint256(current) * Q96) / uint256(entry);
    uint256 numerator = 2 * rQ96;
    uint256 rSquaredQ96 = (rQ96 * rQ96) / Q96;
    uint256 denominator = Q96 + rSquaredQ96;
    uint256 resultQ96 = (numerator * Q96) / denominator;
    uint256 diffQ96 = resultQ96 > Q96 ? resultQ96 - Q96 : Q96 - resultQ96;
    ilBps = (diffQ96 * 10000) / Q96;
}`}</pre>
    </div>
  );
}
