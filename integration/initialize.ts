import { TimeLockedVault } from "./vault";
import { walletClient } from "./chain";

async function main() {
  const vault = new TimeLockedVault();
  
  console.log("=== Initializing Time-Locked Vault ===");
  console.log(`Contract address: ${vault.constructor.prototype.contractAddress}`);
  console.log(`Owner address: ${walletClient.account.address}`);
  console.log("");

  // Set initial parameters
  const baseRewardRate = BigInt(100); // 0.01% per second (in basis points)
  const timeBonusMultiplier = BigInt(150); // 1.5x multiplier for long-term locks

  console.log("Initialization parameters:");
  console.log(`Base reward rate: ${baseRewardRate} basis points`);
  console.log(`Time bonus multiplier: ${timeBonusMultiplier / BigInt(100)}x`);
  console.log("");

  try {
    console.log("Sending initialization transaction...");
    const txHash = await vault.initialize(baseRewardRate, timeBonusMultiplier);
    console.log(`Transaction hash: ${txHash}`);
    console.log("");
    
    console.log("Waiting for confirmation...");
    const receipt = await walletClient.waitForTransactionReceipt({ hash: txHash });
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed}`);
    console.log("");
    
    console.log("✅ Vault initialized successfully!");
  } catch (error) {
    console.error("❌ Initialization failed:", error);
  }
}

main().catch(console.error);