export default function ContractsOverview() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Smart Contracts</h1>
      <p>
        The ILex Protocol consists of six Solidity contracts organized across
        three categories: the core hook, the reactive smart contract, and
        supporting libraries, interfaces, and mocks.
      </p>

      <table>
        <thead>
          <tr>
            <th>Contract</th>
            <th>Location</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ILexHook</td>
            <td><code>src/ILexHook.sol</code></td>
            <td>Uniswap v4 hook — manages LP positions, liquidity, and lending pool interactions</td>
          </tr>
          <tr>
            <td>ILexReactive</td>
            <td><code>src/ILexReactive.sol</code></td>
            <td>Reactive Smart Contract on Lasna — monitors events and fires callbacks</td>
          </tr>
          <tr>
            <td>SwapHelper</td>
            <td><code>src/SwapHelper.sol</code></td>
            <td>Executes swaps on PoolManager via unlock callback</td>
          </tr>
          <tr>
            <td>ILMath</td>
            <td><code>src/libraries/ILMath.sol</code></td>
            <td>Pure math library for IL calculation and price deviation</td>
          </tr>
          <tr>
            <td>MockLendingPool</td>
            <td><code>src/mocks/MockLendingPool.sol</code></td>
            <td>Simulates 3% APY lending pool for testnet</td>
          </tr>
          <tr>
            <td>MockERC20</td>
            <td><code>src/mocks/MockERC20.sol</code></td>
            <td>Test ERC20 token with public mint</td>
          </tr>
        </tbody>
      </table>

      <h2>Network Architecture</h2>
      <pre>{`Unichain Sepolia (Chain 1301)
  ILexHook.sol ←→ PoolManager (Uniswap v4)
               ←→ MockLendingPool
               ←→ Callback Proxy (0x9299472A...)

Reactive Lasna (Chain 5318007)
  ILexReactive.sol ←→ System Contract (0x000...fffFfF)`}</pre>

      <p>
        The hook and lending pool are deployed on <strong>Unichain Sepolia</strong>{" "}
        (Chain 1301). The RSC is deployed on <strong>Reactive Lasna</strong>
        (Chain 5318007). Both use the same chain as origin and destination
        (events originate on Unichain, callbacks are delivered back to Unichain).
      </p>
    </div>
  );
}
