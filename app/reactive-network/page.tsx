export default function ReactiveNetworkPage() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Reactive Network Integration</h1>

      <p>
        Reactive Network is the core automation layer that makes ILex Protocol
        possible. It provides <strong>on-chain, event-driven execution</strong>{" "}
        without off-chain bots, relayers, or cron jobs.
      </p>

      <div className="not-prose p-4 rounded-lg border bg-primary/5 my-6">
        <p className="text-sm font-medium text-primary">Why Reactive Network?</p>
        <p className="text-sm text-muted-foreground mt-1">
          Without Reactive Network, ILex would require a centralized bot to
          monitor swaps and trigger exits — introducing latency, centralization
          risk, and operational overhead. The RSC lives on-chain, runs
          continuously, and reacts instantly. There is no alternative
          infrastructure for this product.
        </p>
      </div>

      <h2>How It Works</h2>

      <h3>1. Event Subscription</h3>
      <p>
        When <code>ILexReactive</code> is deployed on Lasna, it subscribes to
        five event topics from <code>ILexHook</code> on Unichain Sepolia via
        the system contract. These subscriptions tell the Reactive Network which
        events to deliver to the RSC&apos;s <code>react()</code> function.
      </p>
      <p>
        <strong>File:</strong> <code>contracts/src/ILexReactive.sol</code> — constructor +
        <code>subscribeAll()</code>
      </p>

      <h3>2. Event Detection</h3>
      <p>
        The Reactive Network scans origin chains (Unichain Sepolia) for
        subscribed events. When an event matches (contract address + topic0),
        it&apos;s packaged into a <code>LogRecord</code> and delivered to the
        RSC running inside a <strong>ReactVM</strong>.
      </p>

      <h3>3. react() Execution</h3>
      <p>
        Inside the ReactVM, the RSC&apos;s <code>react()</code> function
        processes the event. The RSC maintains LP state across calls (stored in
        ReactVM state — <code>mapping lpStates</code>, <code>trackedLPs</code>).
      </p>
      <p>
        <strong>File:</strong> <code>contracts/src/ILexReactive.sol</code> — lines
        <code>react()</code>, <code>_handlePriceUpdate()</code>
      </p>

      <h3>4. Callback Emission</h3>
      <p>
        When conditions are met (IL ≥ threshold or price recovered), the RSC
        emits a <code>Callback</code> event specifying the destination chain,
        target contract, gas limit, and encoded function call:
      </p>
      <pre>{`emit Callback(
    destinationChainId,  // 1301 (Unichain Sepolia)
    hookAddress,         // ILexHook address
    CALLBACK_GAS_LIMIT,  // 500,000
    payload              // encoded triggerExit() or triggerReentry()
);`}</pre>

      <h3>5. Callback Delivery</h3>
      <p>
        Reactive Network reads the <code>Callback</code> event and submits a
        transaction to the destination chain via the <strong>Callback
        Proxy</strong> contract. The Callback Proxy:
      </p>
      <ul>
        <li>Validates the transaction origin (Reactive Network)</li>
        <li>Replaces the first payload argument with the RVM ID</li>
        <li>Charges the RSC&apos;s balance for gas</li>
        <li>Delivers the callback to the target contract</li>
      </ul>

      <h3>6. Hook Validation</h3>
      <p>
        The ILexHook validates the callback using two modifiers:
      </p>
      <ul>
        <li>
          <code>onlyCallbackProxy</code> — ensures <code>msg.sender</code> is
          the Callback Proxy address
        </li>
        <li>
          <code>onlyAuthorizedRvm(rvm_id)</code> — ensures the RVM ID matches
          the authorized RSC
        </li>
      </ul>
      <p>
        <strong>File:</strong> <code>contracts/src/ILexHook.sol</code> — lines
        <code>triggerExit()</code>, <code>triggerReentry()</code>, modifier
        definitions
      </p>

      <h2>Integration Points</h2>

      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>File</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>RSC</td>
            <td><code>src/ILexReactive.sol</code></td>
            <td>Subscribes to events, executes IL logic, emits callbacks</td>
          </tr>
          <tr>
            <td>Hook</td>
            <td><code>src/ILexHook.sol</code></td>
            <td>Receives callbacks, validates origin, manages positions</td>
          </tr>
          <tr>
            <td>Deploy</td>
            <td><code>script/DeployReactive.s.sol</code></td>
            <td>Deploys RSC with origin/destination chain config</td>
          </tr>
        </tbody>
      </table>

      <h2>Network Parameters</h2>
      <table>
        <thead>
          <tr>
            <th>Network</th>
            <th>Chain ID</th>
            <th>Role</th>
            <th>Callback Proxy</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Unichain Sepolia</td>
            <td>1301</td>
            <td>Origin + Destination</td>
            <td><code>0x9299472A6399Fd1027ebF067571Eb3e3D7837FC4</code></td>
          </tr>
          <tr>
            <td>Reactive Lasna</td>
            <td>5318007</td>
            <td>RSC Deployment</td>
            <td><code>0x8888888888888888888888888888888888888888</code></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
