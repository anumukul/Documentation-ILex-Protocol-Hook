export default function ILMathDoc() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>ILMath.sol</h1>
      <p>
        A pure math library for impermanent loss calculations, price deviation
        measurement, and sqrtPriceX96 conversion. Used by the hook and the
        frontend (mirrored in TypeScript).
      </p>

      <h2>Functions</h2>

      <h3><code>calculateIL(entrySqrtPriceX96, currentSqrtPriceX96)</code></h3>
      <p>
        Returns IL in basis points using the standard impermanent loss formula:
      </p>
      <pre>{`IL = |2r/(1+r²) - 1| where r = sqrt(Pcurrent / Pentry)
Returns: basis points (500 = 5%, 10000 = 100%)`}</pre>
      <p>Known reference values:</p>
      <table>
        <thead>
          <tr>
            <th>Price Change</th>
            <th>IL (bps)</th>
            <th>IL (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>0%</td><td>0</td><td>0%</td></tr>
          <tr><td>±25%</td><td>~192</td><td>~1.92%</td></tr>
          <tr><td>±50%</td><td>~343</td><td>~3.43%</td></tr>
          <tr><td>±100% (2x)</td><td>~572</td><td>~5.72%</td></tr>
          <tr><td>±300% (4x)</td><td>~1,600</td><td>~16%</td></tr>
        </tbody>
      </table>

      <h3><code>priceDeviation(current, entry)</code></h3>
      <p>
        Returns the absolute price deviation in basis points. Simpler than IL —
        just measures how far the current price is from the entry price.
      </p>

      <h3><code>sqrtPriceX96ToPrice(sqrtPriceX96)</code></h3>
      <p>
        Converts a Uniswap v4 sqrtPriceX96 value to a human-readable price with
        18 decimal precision: <code>price = (sqrtPriceX96 / 2⁹⁶)²</code>
      </p>

      <h3><code>expectedILFromRatio(priceRatioBps)</code></h3>
      <p>
        Given a price ratio in basis points (10000 = 1:1, 20000 = 2x), computes
        the expected IL. Uses Babylonian square root for integer math. Useful
        for UI previews and test assertions.
      </p>

      <h2>TypeScript Mirror</h2>
      <p>
        The frontend includes a mirrored implementation in
        <code>frontend/lib/ilmath.ts</code> for client-side IL display:
      </p>
      <pre>{`const Q96 = BigInt(2) ** BigInt(96);

export function calculateILBps(entry, current) {
    const rQ96 = (current * Q96) / entry;
    const numerator = 2n * rQ96;
    const rSquaredQ96 = (rQ96 * rQ96) / Q96;
    const denominator = Q96 + rSquaredQ96;
    const resultQ96 = (numerator * Q96) / denominator;
    const diffQ96 = resultQ96 > Q96 ? resultQ96 - Q96 : Q96 - resultQ96;
    return Number((diffQ96 * 10000n) / Q96);
}`}</pre>
    </div>
  );
}
