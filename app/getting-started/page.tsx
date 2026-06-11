export default function GettingStarted() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Quick Start</h1>

      <h2>Prerequisites</h2>
      <ul>
        <li>Foundry (forge, cast, anvil)</li>
        <li>Node.js 18+</li>
        <li>An Ethereum wallet with private key for Unichain Sepolia</li>
        <li>lREACT tokens on Reactive Lasna (via faucet)</li>
      </ul>

      <h2>Clone &amp; Install</h2>
      <pre>{`git clone https://github.com/anumukul/ILex-Protocol-UHI9
cd ILex-Protocol-UHI9/contracts
forge install`}</pre>

      <h2>Configure Environment</h2>
      <pre>{`cp .env.example .env
# Fill in your private keys and RPC URLs`}</pre>

      <h2>Run Tests</h2>
      <p>All 54 tests pass, covering unit, integration, and fuzz testing:</p>
      <pre>{`forge test -vv`}</pre>

      <h2>Deploy to Unichain Sepolia</h2>
      <pre>{`# Deploy hook + lending pool + initialize pool
forge script script/DeployHook.s.sol \\
  --rpc-url $UNICHAIN_SEPOLIA_RPC \\
  --private-key $UNICHAIN_SEPOLIA_PRIVATE_KEY \\
  --broadcast`}</pre>

      <h2>Deploy RSC to Lasna</h2>
      <pre>{`forge script script/DeployReactive.s.sol \\
  --rpc-url $REACTIVE_RPC \\
  --private-key $REACTIVE_PRIVATE_KEY \\
  --broadcast`}</pre>

      <h2>Link RSC to Hook</h2>
      <pre>{`cast send $ILEX_HOOK_ADDR \\
  "setAuthorizedRvmId(address)" $ILEX_REACTIVE_ADDR \\
  --rpc-url $UNICHAIN_SEPOLIA_RPC \\
  --private-key $UNICHAIN_SEPOLIA_PRIVATE_KEY`}</pre>

      <h2>Start Frontend</h2>
      <pre>{`cd ../frontend
cp .env.example .env.local
# Fill in contract addresses
npm install
npm run dev`}</pre>
    </div>
  );
}
