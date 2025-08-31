import { parseEther, formatEther } from "viem";
import { vaultAbi } from "./abis";
import { walletClient, VAULT_CONTRACT_ADDRESS } from "./chain";

export class TimeLockedVault {
  private contractAddress: `0x${string}`;

  constructor(contractAddress: `0x${string}` = VAULT_CONTRACT_ADDRESS) {
    this.contractAddress = contractAddress;
  }

  async initialize(baseRewardRate: bigint, timeBonusMultiplier: bigint) {
    const txHash = await walletClient.writeContract({
      address: this.contractAddress,
      abi: vaultAbi,
      functionName: "initialize",
      args: [baseRewardRate, timeBonusMultiplier],
    });
    console.log(`Initialize tx: ${txHash}`);
    return txHash;
  }

  async deposit(amount: string, lockPeriod: bigint) {
    const value = parseEther(amount);
    const txHash = await walletClient.writeContract({
      address: this.contractAddress,
      abi: vaultAbi,
      functionName: "deposit",
      args: [lockPeriod],
      value,
    });
    console.log(`Deposit tx: ${txHash}`);
    return txHash;
  }

  async withdraw() {
    const txHash = await walletClient.writeContract({
      address: this.contractAddress,
      abi: vaultAbi,
      functionName: "withdraw",
      args: [],
    });
    console.log(`Withdraw tx: ${txHash}`);
    return txHash;
  }

  async emergencyWithdraw() {
    const txHash = await walletClient.writeContract({
      address: this.contractAddress,
      abi: vaultAbi,
      functionName: "emergencyWithdraw",
      args: [],
    });
    console.log(`Emergency withdraw tx: ${txHash}`);
    return txHash;
  }

  async claimRewards() {
    const txHash = await walletClient.writeContract({
      address: this.contractAddress,
      abi: vaultAbi,
      functionName: "claimRewards",
      args: [],
    });
    console.log(`Claim rewards tx: ${txHash}`);
    return txHash;
  }

  async updateRewardRate(newRate: bigint) {
    const txHash = await walletClient.writeContract({
      address: this.contractAddress,
      abi: vaultAbi,
      functionName: "updateRewardRate",
      args: [newRate],
    });
    console.log(`Update reward rate tx: ${txHash}`);
    return txHash;
  }

  async activateEmergencyMode() {
    const txHash = await walletClient.writeContract({
      address: this.contractAddress,
      abi: vaultAbi,
      functionName: "activateEmergencyMode",
      args: [],
    });
    console.log(`Activate emergency mode tx: ${txHash}`);
    return txHash;
  }

  async calculatePendingRewards(userAddress: `0x${string}`) {
    const rewards = await walletClient.readContract({
      address: this.contractAddress,
      abi: vaultAbi,
      functionName: "calculatePendingRewards",
      args: [userAddress],
    });
    return rewards;
  }

  async getDepositInfo(userAddress: `0x${string}`) {
    const info = await walletClient.readContract({
      address: this.contractAddress,
      abi: vaultAbi,
      functionName: "getDepositInfo",
      args: [userAddress],
    });
    return {
      amount: info[0],
      depositTime: info[1],
      lockPeriod: info[2],
      lastClaimTime: info[3],
    };
  }

  async getTotalLocked() {
    const total = await walletClient.readContract({
      address: this.contractAddress,
      abi: vaultAbi,
      functionName: "getTotalLocked",
      args: [],
    });
    return total;
  }

  async fundVault(amount: string) {
    const value = parseEther(amount);
    const txHash = await walletClient.writeContract({
      address: this.contractAddress,
      abi: vaultAbi,
      functionName: "fundVault",
      args: [],
      value,
    });
    console.log(`Fund vault tx: ${txHash}`);
    return txHash;
  }

  async getEmergencyMode() {
    const emergencyMode = await walletClient.readContract({
      address: this.contractAddress,
      abi: vaultAbi,
      functionName: "getEmergencyMode",
      args: [],
    });
    return emergencyMode;
  }

  async withdrawVault() {
    const txHash = await walletClient.writeContract({
      address: this.contractAddress,
      abi: vaultAbi,
      functionName: "withdrawVault",
      args: [],
    });
    console.log(`Withdraw vault tx: ${txHash}`);
    return txHash;
  }
}
