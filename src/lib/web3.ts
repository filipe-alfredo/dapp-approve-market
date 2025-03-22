
import { toast } from "sonner";
import { ICO_ABI, ERC20_ABI, ICO_CONTRACT_ADDRESS, TOKEN_ADDRESS, TOKEN_DECIMALS, SUPPORTED_CHAIN_IDS } from "./constants";

// Type declarations
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Helper functions
export function formatAddress(address: string): string {
  return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : "";
}

export function formatAmount(amount: number | string, decimals: number = TOKEN_DECIMALS): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return num.toFixed(6).replace(/\.?0+$/, "");
}

export function formatEther(wei: string): string {
  return (parseInt(wei) / 1e18).toFixed(6).replace(/\.?0+$/, "");
}

export function parseEther(ether: string): string {
  return (parseFloat(ether) * 1e18).toString();
}

// Web3 connection functions
export async function connectWallet(): Promise<string | null> {
  if (!window.ethereum) {
    toast.error("No wallet detected. Please install MetaMask.");
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    
    // Check if connected to supported network
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const chainIdNum = parseInt(chainId, 16);
    
    if (!SUPPORTED_CHAIN_IDS.includes(chainIdNum)) {
      toast.error("Please connect to a supported network.");
      return null;
    }
    
    return accounts[0];
  } catch (error: any) {
    console.error("Error connecting wallet:", error);
    toast.error(error.message || "Failed to connect wallet");
    return null;
  }
}

export async function getTokenBalance(address: string): Promise<string> {
  if (!window.ethereum || !address) return "0";

  try {
    // Create contract instance
    const data = {
      to: TOKEN_ADDRESS,
      data: getEncodedFunctionData("balanceOf", ["address"], [address])
    };
    
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [data, "latest"]
    });
    
    // Parse result - convert hex to decimal
    const balanceInWei = parseInt(result, 16).toString();
    const balanceInToken = formatAmount(balanceInWei);
    
    return balanceInToken;
  } catch (error) {
    console.error("Error getting token balance:", error);
    return "0";
  }
}

export async function getAllowance(owner: string, spender: string = ICO_CONTRACT_ADDRESS): Promise<string> {
  if (!window.ethereum || !owner) return "0";

  try {
    // Create contract instance
    const data = {
      to: TOKEN_ADDRESS,
      data: getEncodedFunctionData("allowance", ["address", "address"], [owner, spender])
    };
    
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [data, "latest"]
    });
    
    // Parse result - convert hex to decimal
    const allowanceInWei = parseInt(result, 16).toString();
    return allowanceInWei;
  } catch (error) {
    console.error("Error getting allowance:", error);
    return "0";
  }
}

export async function approveTokens(spender: string = ICO_CONTRACT_ADDRESS, amount: string): Promise<boolean> {
  if (!window.ethereum) {
    toast.error("No wallet detected");
    return false;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (!accounts || accounts.length === 0) {
      toast.error("Please connect your wallet");
      return false;
    }

    // Convert amount to wei
    const amountInWei = parseEther(amount);
    
    // Encode function data
    const data = getEncodedFunctionData("approve", ["address", "uint256"], [spender, amountInWei]);
    
    // Send transaction
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [{
        from: accounts[0],
        to: TOKEN_ADDRESS,
        data
      }]
    });
    
    toast.success("Approval transaction sent");
    
    // Wait for transaction to be mined
    const receipt = await waitForTransaction(txHash);
    if (receipt.status) {
      toast.success("Token approval successful");
      return true;
    } else {
      toast.error("Token approval failed");
      return false;
    }
  } catch (error: any) {
    console.error("Error approving tokens:", error);
    toast.error(error.message || "Failed to approve tokens");
    return false;
  }
}

export async function buyTokens(amount: string): Promise<boolean> {
  if (!window.ethereum) {
    toast.error("No wallet detected");
    return false;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (!accounts || accounts.length === 0) {
      toast.error("Please connect your wallet");
      return false;
    }

    // Get token price
    const tokenPrice = await getTokenPrice();
    
    // Calculate ETH value to send
    const ethAmount = (parseFloat(amount) * parseFloat(tokenPrice)).toString();
    const weiAmount = parseEther(ethAmount);
    
    // Convert amount to wei for the function argument
    const amountInWei = parseEther(amount);
    
    // Encode function data
    const data = getEncodedFunctionData("buyTokens", ["uint256"], [amountInWei]);
    
    // Send transaction
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [{
        from: accounts[0],
        to: ICO_CONTRACT_ADDRESS,
        value: weiAmount,
        data
      }]
    });
    
    toast.success("Purchase transaction sent");
    
    // Wait for transaction to be mined
    const receipt = await waitForTransaction(txHash);
    if (receipt.status) {
      toast.success("Token purchase successful");
      return true;
    } else {
      toast.error("Token purchase failed");
      return false;
    }
  } catch (error: any) {
    console.error("Error buying tokens:", error);
    toast.error(error.message || "Failed to buy tokens");
    return false;
  }
}

async function getTokenPrice(): Promise<string> {
  try {
    // Create contract instance
    const data = {
      to: ICO_CONTRACT_ADDRESS,
      data: getEncodedFunctionData("tokenPrice", [], [])
    };
    
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [data, "latest"]
    });
    
    // Parse result - convert hex to decimal
    const priceInWei = parseInt(result, 16).toString();
    const priceInEth = formatEther(priceInWei);
    
    return priceInEth;
  } catch (error) {
    console.error("Error getting token price:", error);
    return "0.001"; // Default fallback price
  }
}

export async function getTokensSold(): Promise<string> {
  try {
    // Create contract instance
    const data = {
      to: ICO_CONTRACT_ADDRESS,
      data: getEncodedFunctionData("tokensSold", [], [])
    };
    
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [data, "latest"]
    });
    
    // Parse result - convert hex to decimal
    const soldInWei = parseInt(result, 16).toString();
    const sold = formatAmount(soldInWei);
    
    return sold;
  } catch (error) {
    console.error("Error getting tokens sold:", error);
    return "0"; 
  }
}

export async function getTokensAvailable(): Promise<string> {
  try {
    // Create contract instance
    const data = {
      to: ICO_CONTRACT_ADDRESS,
      data: getEncodedFunctionData("tokensAvailable", [], [])
    };
    
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [data, "latest"]
    });
    
    // Parse result - convert hex to decimal
    const availableInWei = parseInt(result, 16).toString();
    const available = formatAmount(availableInWei);
    
    return available;
  } catch (error) {
    console.error("Error getting tokens available:", error);
    return "1000000"; // Default fallback
  }
}

// Helper function to encode function data
function getEncodedFunctionData(functionName: string, types: string[], values: any[]): string {
  // Create function signature
  const functionSignature = `${functionName}(${types.join(',')})`;
  
  // Create function selector (first 4 bytes of keccak256 hash of function signature)
  const functionSelector = `0x${keccak256(functionSignature).substring(0, 8)}`;
  
  // Encode parameters if any
  if (types.length === 0) {
    return functionSelector;
  }
  
  // Simple encoding for common types (this is a simplified version)
  let encodedParams = '';
  
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    const value = values[i];
    
    if (type === 'address') {
      // Encode address as 32 bytes (pad to 64 chars)
      encodedParams += value.substring(2).padStart(64, '0');
    } else if (type === 'uint256') {
      // Encode uint256 as 32 bytes (pad to 64 chars)
      const hex = BigInt(value).toString(16);
      encodedParams += hex.padStart(64, '0');
    }
    // Add more types as needed
  }
  
  return `${functionSelector}${encodedParams}`;
}

// Simple keccak256 function (for demo purposes - use a proper library in production)
function keccak256(str: string): string {
  // This is a placeholder. In a real application, use a proper keccak256 implementation
  // such as ethers.utils.keccak256 or web3.utils.keccak256
  // For this demo, we'll just return a fixed value to simulate the hash
  return '0c9a0b61414c8cfeacab2e19c4813abe90afe781'; // Example hash (not real keccak256)
}

// Helper function to wait for transaction receipt
async function waitForTransaction(txHash: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const checkReceipt = async () => {
      try {
        const receipt = await window.ethereum.request({
          method: "eth_getTransactionReceipt",
          params: [txHash]
        });
        
        if (receipt) {
          resolve(receipt);
        } else {
          setTimeout(checkReceipt, 1000);
        }
      } catch (error) {
        reject(error);
      }
    };
    
    checkReceipt();
  });
}

// Listen for chain changes
export function setupChainListeners(callback: () => void): () => void {
  if (!window.ethereum) return () => {};

  const handleChainChanged = () => {
    callback();
  };

  window.ethereum.on('chainChanged', handleChainChanged);
  
  return () => {
    window.ethereum.removeListener('chainChanged', handleChainChanged);
  };
}

// Listen for account changes
export function setupAccountListeners(callback: () => void): () => void {
  if (!window.ethereum) return () => {};

  const handleAccountsChanged = () => {
    callback();
  };

  window.ethereum.on('accountsChanged', handleAccountsChanged);
  
  return () => {
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
  };
}
