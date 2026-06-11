export default function ILexHookDoc() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>ILexHook.sol</h1>
      <p>
        The core Uniswap v4 hook contract. It manages LP positions, handles
        liquidity addition and removal via PoolManager, and interfaces with the
        lending pool for yield parking.
      </p>

      <h2>Permissions</h2>
      <p>The hook uses the <code>afterSwap</code> flag only:</p>
      <pre>{`function getHookPermissions() public pure returns (Hooks.Permissions memory) {
    return Hooks.Permissions({
        beforeInitialize: false,  afterInitialize: false,
        beforeAddLiquidity: false, afterAddLiquidity: false,
        beforeRemoveLiquidity: false, afterRemoveLiquidity: false,
        beforeSwap: false,        afterSwap: true,
        beforeDonate: false,      afterDonate: false,
        ...
    });
}`}</pre>

      <h2>Key Functions</h2>

      <h3><code>deposit()</code></h3>
      <p>
        Transfers tokens from the LP, adds liquidity to the v4 pool via
        <code>poolManager.unlock()</code>, and stores the LP position with
        entry price, thresholds, and tick range.
      </p>
      <pre>{`function deposit(
    PoolKey calldata key,
    int24 tickLower, int24 tickUpper,
    uint256 amount0Desired, uint256 amount1Desired,
    uint256 ilThresholdBps, uint256 reentryToleranceBps
) external nonReentrant returns (uint128 liquidity)`}</pre>

      <h3><code>triggerExit()</code></h3>
      <p>
        Called by the Callback Proxy (authenticated via
        <code>onlyCallbackProxy</code> and <code>onlyAuthorizedRvm</code>).
        Removes LP liquidity from the pool and deposits both tokens into the
        lending pool.
      </p>
      <pre>{`function triggerExit(address rvm_id, address lp)
    external nonReentrant onlyCallbackProxy onlyAuthorizedRvm(rvm_id)`}</pre>

      <h3><code>triggerReentry()</code></h3>
      <p>
        Called by the Callback Proxy when price recovers. Withdraws tokens plus
        accrued yield from the lending pool and re-adds liquidity at the
        original tick range. Excess tokens from ratio mismatch are sent to the
        LP.
      </p>
      <pre>{`function triggerReentry(address rvm_id, address lp)
    external nonReentrant onlyCallbackProxy onlyAuthorizedRvm(rvm_id)`}</pre>

      <h3><code>manualExit()</code></h3>
      <p>
        Allows the LP to exit at any time. Handles both active positions
        (removes liquidity from pool) and parked positions (withdraws from
        lending pool). Returns all tokens including accrued yield.
      </p>

      <h3><code>afterSwap()</code></h3>
      <p>
        Hook callback after every swap. Reads the current slot0 price and emits
        a <code>PriceUpdate</code> event for the RSC to consume.
      </p>

      <h2>Events</h2>
      <ul>
        <li><code>PositionCreated</code> — LP deposits and registers protection</li>
        <li><code>PositionExited</code> — Position exited, funds parked in lending pool</li>
        <li><code>PositionReentered</code> — Position restored with yield</li>
        <li><code>ManualExit</code> — LP manually exited</li>
        <li><code>PriceUpdate</code> — Emitted after every swap for RSC monitoring</li>
        <li><code>RvmIdSet</code> — Authorized RVM ID configured</li>
      </ul>

      <h2>State Machine</h2>
      <pre>{`NONE → ACTIVE → EXITING → EXITED → REENTERING → ACTIVE
                     ↘                   ↙
                    ManualExit       ManualExit`}</pre>
    </div>
  );
}
