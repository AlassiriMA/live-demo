// Metamask integration utilities

/**
 * Type definition for injected Ethereum provider by MetaMask
 */
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
    };
  }
}

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && 
    window.ethereum !== undefined && 
    window.ethereum.isMetaMask === true;
};

/**
 * Connect to MetaMask and get user accounts
 * Returns the first account address or null if connection failed
 */
export const connectMetaMask = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    console.error('MetaMask is not installed');
    return null;
  }

  try {
    // Request account access
    const accounts = await window.ethereum!.request({
      method: 'eth_requestAccounts'
    });

    if (accounts && accounts.length > 0) {
      return accounts[0] as string;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to connect to MetaMask:', error);
    return null;
  }
};

/**
 * Get the current Ethereum chain ID
 */
export const getChainId = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const chainId = await window.ethereum!.request({
      method: 'eth_chainId'
    });
    
    return chainId as string;
  } catch (error) {
    console.error('Error getting chain ID:', error);
    return null;
  }
};

/**
 * Helper to switch to a specific chain
 */
export const switchToChain = async (chainId: string): Promise<boolean> => {
  if (!isMetaMaskInstalled()) {
    return false;
  }

  try {
    await window.ethereum!.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
    return true;
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      // Add the network (this would depend on the chain you want to add)
      console.error('This network needs to be added to MetaMask');
    } else {
      console.error('Error switching chain:', error);
    }
    return false;
  }
};

/**
 * Get account balance in Ether
 */
export const getBalance = async (address: string): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const balance = await window.ethereum!.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });
    
    // Convert from wei to ether (division by 10^18)
    const etherValue = parseInt(balance as string, 16) / 1e18;
    return etherValue.toFixed(4);
  } catch (error) {
    console.error('Error getting balance:', error);
    return null;
  }
};