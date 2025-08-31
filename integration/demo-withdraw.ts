import { formatEther, parseEther } from "viem";
import { TimeLockedVault } from "./vault";
import { walletClient } from "./chain";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const vault = new TimeLockedVault();
  const userAddress = walletClient.account.address;

  console.log("=== Time-Locked Vault Demo ===");
  console.log(`User address: ${userAddress}`);
  console.log("");

  // Step 0: Check if the vault emergency mode is active
  console.log("Step 0: Checking if the vault emergency mode is active...");
  let emergencyMode = await vault.getEmergencyMode();
  console.log(`Emergency mode active: ${emergencyMode}`);
  console.log("");


  // check if the vault emergency mode is active
  console.log("Step 2: Checking if the vault emergency mode is active...");
  emergencyMode = await vault.getEmergencyMode();
  console.log(`Emergency mode active: ${emergencyMode}`);
  console.log("");

  // // Step 2: Make a deposit
  // console.log("Step 2: Making a deposit...");
  // const depositAmount = "0.2";
  // const lockPeriod = BigInt(86400); // 1 day
  // console.log(
  //   `Depositing ${depositAmount} ETH with ${lockPeriod} second lock period`
  // );

  // try {
  //   const depositTx = await vault.deposit(depositAmount, lockPeriod);
  //   const depositTx2 = await vault.deposit(depositAmount, lockPeriod);
  //   console.log(`Deposit tx: ${depositTx}`);
  //   console.log(`Deposit tx2: ${depositTx2}`);
  //   await walletClient.waitForTransactionReceipt({ hash: depositTx });
  //   await walletClient.waitForTransactionReceipt({ hash: depositTx2 });
  //   console.log("✅ Deposit successful!");
  // } catch (error) {
  //   console.error("Deposit failed:", error);
  // }
  // console.log("");

  // Step 3: Check deposit info
  console.log("Step 3: Checking deposit info...");
  const depositInfo = await vault.getDepositInfo(userAddress);
  console.log(`Amount deposited: ${formatEther(depositInfo.amount)} ETH`);
  console.log(
    `Deposit time: ${new Date(
      Number(depositInfo.depositTime) * 1000
    ).toLocaleString()}`
  );
  console.log(`Lock period: ${depositInfo.lockPeriod} seconds`);

  const totalLocked = await vault.getTotalLocked();
  console.log(`Total locked in vault: ${formatEther(totalLocked)} ETH`);
  console.log("");

  // Step 4: Check pending rewards
  console.log("Step 4: Calculating rewards...");
  console.log("Waiting 10 seconds for rewards to accumulate...");
  await sleep(10000);

  const pendingRewards = await vault.calculatePendingRewards(userAddress);
  console.log(`Pending rewards: ${formatEther(pendingRewards)} ETH`);
  console.log("");

  // owner withdraw the vault funds
  console.log("Step 5: Owner withdrawing vault funds...");
  const withdrawVaultTx = await vault.withdrawVault();
  console.log(`Withdraw vault tx: ${withdrawVaultTx}`);
  await walletClient.waitForTransactionReceipt({ hash: withdrawVaultTx });
  console.log("✅ Vault funds withdrawn!");
  console.log("");
}

main().catch(console.error);
