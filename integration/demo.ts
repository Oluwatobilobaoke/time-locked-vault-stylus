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

  // Step 1: Check initial state
  console.log("Step 1: Checking initial vault state...");
  let totalLocked = await vault.getTotalLocked();
  console.log(`Total locked: ${formatEther(totalLocked)} ETH`);

  let depositInfo = await vault.getDepositInfo(userAddress);
  console.log(`User deposit: ${formatEther(depositInfo.amount)} ETH`);
  console.log("");

  // Step 2: Make a deposit
  console.log("Step 2: Making a deposit...");
  const depositAmount = "0.01";
  const lockPeriod = BigInt(86400); // 1 day
  console.log(
    `Depositing ${depositAmount} ETH with ${lockPeriod} second lock period`
  );

  try {
    const depositTx = await vault.deposit(depositAmount, lockPeriod);
    const depositTx2 = await vault.deposit(depositAmount, lockPeriod);
    console.log(`Deposit tx: ${depositTx}`);
    console.log(`Deposit tx2: ${depositTx2}`);
    await walletClient.waitForTransactionReceipt({ hash: depositTx });
    await walletClient.waitForTransactionReceipt({ hash: depositTx2 });
    console.log("✅ Deposit successful!");
  } catch (error) {
    console.error("Deposit failed:", error);
  }
  console.log("");

  // Step 3: Check deposit info
  console.log("Step 3: Checking deposit info...");
  depositInfo = await vault.getDepositInfo(userAddress);
  console.log(`Amount deposited: ${formatEther(depositInfo.amount)} ETH`);
  console.log(
    `Deposit time: ${new Date(
      Number(depositInfo.depositTime) * 1000
    ).toLocaleString()}`
  );
  console.log(`Lock period: ${depositInfo.lockPeriod} seconds`);

  totalLocked = await vault.getTotalLocked();
  console.log(`Total locked in vault: ${formatEther(totalLocked)} ETH`);
  console.log("");

  // Step 4: Check pending rewards
  console.log("Step 4: Calculating rewards...");
  console.log("Waiting 10 seconds for rewards to accumulate...");
  await sleep(10000);

  const pendingRewards = await vault.calculatePendingRewards(userAddress);
  console.log(`Pending rewards: ${formatEther(pendingRewards)} ETH`);
  console.log("");

  // Step 5: Claim rewards
  console.log("Step 5: Claiming rewards...");
  try {
    const claimTx = await vault.claimRewards();
    console.log(`Claim tx: ${claimTx}`);
    await walletClient.waitForTransactionReceipt({ hash: claimTx });
    console.log("✅ Rewards claimed!");
  } catch (error) {
    console.error("Claim failed:", error);
  }
  console.log("");

  // Step 6: Try to withdraw (may fail if still locked)
  console.log("Step 6: Attempting withdrawal...");
  const currentTime = BigInt(Math.floor(Date.now() / 1000));
  const unlockTime = depositInfo.depositTime + depositInfo.lockPeriod;

  if (currentTime < unlockTime) {
    const remainingTime = unlockTime - currentTime;
    console.log(`⏳ Funds still locked for ${remainingTime} seconds`);
    console.log("Use emergencyWithdraw() to withdraw with penalty if needed");
  } else {
    try {
      const withdrawTx = await vault.withdraw();
      console.log(`Withdraw tx: ${withdrawTx}`);
      await walletClient.waitForTransactionReceipt({ hash: withdrawTx });
      console.log("✅ Withdrawal successful!");
    } catch (error) {
      console.error("Withdrawal failed:", error);
    }
  }
  console.log("");

  console.log("=== Demo Complete ===");

  // Step 7: Check if the vault emergency mode is active
  console.log("Step 7: Checking if the vault emergency mode is active...");
  emergencyMode = await vault.getEmergencyMode();
  console.log(`Emergency mode active: ${emergencyMode}`);
  console.log("");

  //activate the emergency mode
  console.log("Step 8: Activating the emergency mode...");
  const activateEmergencyModeTx = await vault.activateEmergencyMode();
  console.log(`Activate emergency mode tx: ${activateEmergencyModeTx}`);
  await walletClient.waitForTransactionReceipt({
    hash: activateEmergencyModeTx,
  });
  console.log("✅ Emergency mode activated!");
  console.log("");

  // Step 9: Check if the vault emergency mode is active
  console.log("Step 9: Checking if the vault emergency mode is active...");
  emergencyMode = await vault.getEmergencyMode();
  console.log(`Emergency mode active: ${emergencyMode}`);
  console.log("");

  //emergency withdraw
  console.log("Step 10: Attempting emergency withdrawal...");
  const emergencyWithdrawTx = await vault.emergencyWithdraw();
  console.log(`Emergency withdraw tx: ${emergencyWithdrawTx}`);
  await walletClient.waitForTransactionReceipt({ hash: emergencyWithdrawTx });
  console.log("✅ Emergency withdrawal successful!");
  console.log("");
}

main().catch(console.error);
