export default function DeploymentPage() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Deployment Guide</h1>

      <h2>Network Setup</h2>
      <pre>{`# .env configuration
UNICHAIN_SEPOLIA_RPC=https://sepolia.unichain.org
UNICHAIN_SEPOLIA_PRIVATE_KEY=0x...
UNICHAIN_CHAIN_ID=1301

REACTIVE_RPC=https://lasna-rpc.rnk.dev/
REACTIVE_PRIVATE_KEY=0x...
REACTIVE_CHAIN_ID=5318007

SYSTEM_CONTRACT_ADDR=0x0000000000000000000000000000000000fffFfF
CALLBACK_PROXY_ADDR=0x9299472A6399Fd1027ebF067571Eb3e3D7837FC4
POOL_MANAGER_ADDR=0x00B036B58a818B1BC34d502D3fE730Db729e62AC`}</pre>

      <h2>Step 1: Deploy Hook + Lending Pool</h2>
      <p>
        Deploys mock ERC20 tokens, MockLendingPool, and ILexHook with CREATE2
        address mining (ensures the hook address has the <code>afterSwap</code>
        permission flag). Initializes a test pool at 1:1 price.
      </p>
      <pre>{`forge script script/DeployHook.s.sol \\
  --rpc-url $UNICHAIN_SEPOLIA_RPC \\
  --private-key $UNICHAIN_SEPOLIA_PRIVATE_KEY \\
  --broadcast`}</pre>

      <h2>Step 2: Deploy SwapHelper</h2>
      <p>
        A helper contract for executing swaps on the PoolManager via unlock
        callbacks. Used during testing and demos to simulate price movement.
      </p>
      <pre>{`forge script script/DeploySwapHelper.s.sol \\
  --rpc-url $UNICHAIN_SEPOLIA_RPC \\
  --private-key $UNICHAIN_SEPOLIA_PRIVATE_KEY \\
  --broadcast`}</pre>

      <h2>Step 3: Deploy RSC to Lasna</h2>
      <p>
        Deploys ILexReactive on the Reactive Network Lasna testnet. Passes
        origin chain ID (1301), destination chain ID (1301), and the hook
        address. The constructor automatically subscribes to all events.
      </p>
      <pre>{`forge script script/DeployReactive.s.sol \\
  --rpc-url $REACTIVE_RPC \\
  --private-key $REACTIVE_PRIVATE_KEY \\
  --broadcast`}</pre>

      <h2>Step 4: Link RSC to Hook</h2>
      <p>
        Sets the deployed RSC&apos;s address as the authorized RVM ID in the
        hook. This enables the hook to verify that callbacks originate from the
        correct RSC.
      </p>
      <pre>{`cast send $ILEX_HOOK_ADDR \\
  "setAuthorizedRvmId(address)" $ILEX_REACTIVE_ADDR \\
  --rpc-url $UNICHAIN_SEPOLIA_RPC \\
  --private-key $UNICHAIN_SEPOLIA_PRIVATE_KEY`}</pre>

      <h2>Step 5: Subscribe Events</h2>
      <p>
        Calls <code>subscribeAll()</code> on the RSC to register event
        subscriptions with the system contract. Each subscription has a fee
        that&apos;s deducted from the RSC&apos;s balance.
      </p>
      <pre>{`cast send $ILEX_REACTIVE_ADDR \\
  "subscribeAll()" \\
  --rpc-url $REACTIVE_RPC \\
  --private-key $REACTIVE_PRIVATE_KEY`}</pre>

      <h2>Step 6: Fund RSC</h2>
      <p>
        The RSC needs lREACT balance to pay for callback gas. Send at least
        0.01 lREACT.
      </p>
      <pre>{`cast send $ILEX_REACTIVE_ADDR \\
  --value 0.01ether \\
  --rpc-url $REACTIVE_RPC \\
  --private-key $REACTIVE_PRIVATE_KEY`}</pre>

      <h2>Step 7: Deposit &amp; Test</h2>
      <p>
        Use the frontend at <code>/deposit</code> to create a position, or call
        <code>deposit()</code> directly via cast. Execute swaps via SwapHelper
        to trigger price movement and observe the RSC firing callbacks.
      </p>
    </div>
  );
}
