export default function Home() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>ILex Protocol</h1>
      <p className="lead text-lg text-muted-foreground">
        Automated impermanent loss protection and yield parking for Uniswap v4
        liquidity providers, powered by Reactive Network.
      </p>

      <div className="not-prose grid gap-4 sm:grid-cols-2 my-8">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-semibold text-primary mb-1">
            Impermanent Loss Protection
          </div>
          <div className="text-sm text-muted-foreground">
            Set your IL tolerance — when breached, the RSC auto-exits your
            position. No bots, no monitoring.
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-semibold text-primary mb-1">
            Yield While Parked
          </div>
          <div className="text-sm text-muted-foreground">
            Exited funds earn yield in a lending pool until price recovers and
            the position re-enters.
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-semibold text-primary mb-1">
            Fully On-Chain Automation
          </div>
          <div className="text-sm text-muted-foreground">
            Powered by Reactive Network — no keepers, no cron jobs, no
            off-chain relayers.
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-semibold text-primary mb-1">
            Auto Re-Entry
          </div>
          <div className="text-sm text-muted-foreground">
            When price recovers within tolerance, the RSC re-adds liquidity
            with the original tick range.
          </div>
        </div>
      </div>

      <h2>Problem</h2>
      <p>
        Uniswap v4 liquidity providers face impermanent loss when pool prices
        move away from their entry price. Managing LP positions requires constant
        monitoring — checking IL levels, deciding when to exit, and manually
        executing transactions. Missing the right moment can mean significant
        losses.
      </p>

      <h2>Solution</h2>
      <p>
        ILex Protocol eliminates manual monitoring. An LP deposits once, sets
        their IL tolerance and reentry preferences, and the protocol handles the
        rest. A Reactive Smart Contract (RSC) on the Reactive Network monitors
        every swap. When IL exceeds the LP&#39;s threshold, it fires a callback
        that exits the position and parks funds in a lending pool. When price
        recovers, it fires another callback that re-enters the position — all
        autonomously, all on-chain.
      </p>

      <h2>Lifecycle</h2>
      <ol>
        <li>
          <strong>Deposit:</strong> LP calls <code>deposit()</code> on the
          ILexHook with tokens, tick range, IL threshold, and reentry tolerance.
          Liquidity is added to the v4 pool.
        </li>
        <li>
          <strong>Monitor:</strong> The RSC on Reactive Network listens for
          <code>PriceUpdate</code> events emitted by the hook after every swap.
        </li>
        <li>
          <strong>Exit:</strong> When IL ≥ threshold, the RSC emits a
          <code>Callback</code> event. Reactive Network delivers it to the
          ILexHook which removes liquidity and parks tokens in the lending pool.
        </li>
        <li>
          <strong>Yield:</strong> Parked tokens earn yield while the position
          is inactive.
        </li>
        <li>
          <strong>Re-enter:</strong> When price deviation ≤ reentry tolerance,
          the RSC fires another callback. The hook withdraws from the lending
          pool and re-adds liquidity.
        </li>
      </ol>

      <h2>Architecture</h2>
      <pre>{`Unichain Sepolia (Chain 1301)
  ILexHook.sol
    deposit() / manualExit()     ← LP interactions
    triggerExit()                ← Called by RSC via Callback Proxy
    triggerReentry()             ← Called by RSC via Callback Proxy
    afterSwap() → PriceUpdate    ← Emitted on every swap
    PoolManager                  ← Uniswap v4
    MockLendingPool              ← Yield while parked

Reactive Network Lasna (Chain 5318007)
  ILexReactive.sol
    react()                      ← Receives subscribed events
    _handlePositionCreated()     ← Registers LP
    _handlePriceUpdate()         ← Checks IL, fires callbacks
    _handlePositionExited()      ← Updates LP status
    _handlePositionReentered()   ← Resets LP tracking
    _handleManualExit()          ← Removes LP from tracking`}</pre>

      <div className="not-prose mt-8 p-4 rounded-lg border bg-muted/50">
        <p className="text-sm text-muted-foreground">
          <strong>Event:</strong> Uniswap Hook Incubator 9 (UHI9) Hookathon ·
          <strong> Theme:</strong> Impermanent Loss &amp; Yield Systems ·
          <strong> Demo Day:</strong> June 19, 2026
        </p>
      </div>
    </div>
  );
}
