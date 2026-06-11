export default function TestsPage() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Test Suite</h1>
      <p>
        All tests pass across 4 test files, covering unit tests, integration
        tests, and fuzz testing. The tests use Forge&apos;s standard library,
        Uniswap v4&apos;s <code>Deployers</code> helper, and
        <code>reactive-test-lib</code> for RSC simulation.
      </p>

      <pre>{`forge test -vv`}</pre>

      <h2>Test Breakdown</h2>

      <h3>ILexHook.t.sol (21 tests)</h3>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Tests</th>
            <th>What It Verifies</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Deposit</td>
            <td>5</td>
            <td>Creates position, reverts on duplicate, validates thresholds and amounts</td>
          </tr>
          <tr>
            <td>Exit</td>
            <td>4</td>
            <td>Moves liquidity to lending pool, validates callback proxy and RVM ID, prevents double exit</td>
          </tr>
          <tr>
            <td>Reentry</td>
            <td>1</td>
            <td>Returns to pool with restored liquidity, yield included</td>
          </tr>
          <tr>
            <td>Manual Exit</td>
            <td>2</td>
            <td>Exits from active and parked positions, returns tokens with yield</td>
          </tr>
          <tr>
            <td>Yield</td>
            <td>1</td>
            <td>Estimates positive yield after time passes</td>
          </tr>
          <tr>
            <td>Permissions</td>
            <td>3</td>
            <td>Owner-only RVM ID set, callback proxy validation, RVM ID validation</td>
          </tr>
          <tr>
            <td>State</td>
            <td>3</td>
            <td>getCurrentIL, getParkedFunds, getPositionStatus</td>
          </tr>
          <tr>
            <td>Multi-LP</td>
            <td>1</td>
            <td>Independent positions for multiple LPs</td>
          </tr>
        </tbody>
      </table>

      <h3>ILexReactive.t.sol (8 tests)</h3>
      <table>
        <thead>
          <tr>
            <th>Test</th>
            <th>What It Verifies</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>PositionCreated</td>
            <td>LP registered with correct entry price, threshold, and ACTIVE status</td>
          </tr>
          <tr>
            <td>Exit callback fires</td>
            <td>Price breach over threshold triggers a callback to hook</td>
          </tr>
          <tr>
            <td>No callback below threshold</td>
            <td>Small price move does not trigger exit</td>
          </tr>
          <tr>
            <td>No duplicate exit</td>
            <td>Second breach while EXITING does not fire another callback</td>
          </tr>
          <tr>
            <td>Reentry callback</td>
            <td>After exit, price recovery within tolerance triggers reentry callback</td>
          </tr>
          <tr>
            <td>Cooldown</td>
            <td>Reentry prevented before cooldown blocks elapse</td>
          </tr>
          <tr>
            <td>Manual exit removes LP</td>
            <td>LP removed from trackedLPs array, state cleared</td>
          </tr>
          <tr>
            <td>Multi-LP tracking</td>
            <td>Two LPs with different thresholds — only the lower-threshold LP triggers</td>
          </tr>
        </tbody>
      </table>

      <h3>ILexIntegration.t.sol (8 tests)</h3>
      <table>
        <thead>
          <tr>
            <th>Test</th>
            <th>What It Verifies</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Full protection cycle</td>
            <td>Deposit → exit → 30d yield → reentry with yield included</td>
          </tr>
          <tr>
            <td>Manual exit (active)</td>
            <td>LP exits an active position, receives tokens back</td>
          </tr>
          <tr>
            <td>Manual exit (parked)</td>
            <td>LP exits a parked position, receives tokens + yield</td>
          </tr>
          <tr>
            <td>Reentrancy guard</td>
            <td>nonReentrant modifier active on deposit/exit/reentry</td>
          </tr>
          <tr>
            <td>Two LPs independent</td>
            <td>Two full cycles run independently without interference</td>
          </tr>
          <tr>
            <td>Yield matches expected</td>
            <td>Yield formula matches 3% APY over elapsed time</td>
          </tr>
          <tr>
            <td>ILMath reference values</td>
            <td>Known IL values at 1x, 2x, 4x price changes</td>
          </tr>
          <tr>
            <td>{'Fuzz: IL never > 10000'}</td>
            <td>256 random price pairs, IL never exceeds 100%</td>
          </tr>
        </tbody>
      </table>

      <h3>ILMath.t.sol (17 tests)</h3>
      <p>
        Comprehensive math tests covering <code>calculateIL</code>,
        <code>priceDeviation</code>, <code>sqrtPriceX96ToPrice</code>, and
        <code>expectedILFromRatio</code> — including symmetry properties,
        monotonicity, boundary conditions, and fuzz testing.
      </p>
    </div>
  );
}
