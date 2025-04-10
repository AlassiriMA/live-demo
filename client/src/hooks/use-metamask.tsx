import { useState, useEffect, useCallback } from 'react';
import { connectMetaMask, isMetaMaskInstalled, getChainId, getBalance } from '@/lib/web3/metamask';
import { useToast } from '@/hooks/use-toast';

export type MetaMaskState = {
  isInstalled: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  chainId: string | null;
  balance: string | null;
  error: string | null;
};

function useMetaMask() {
  const { toast } = useToast();
  const [state, setState] = useState<MetaMaskState>({
    isInstalled: false,
    isConnected: false,
    isConnecting: false,
    address: null,
    chainId: null,
    balance: null,
    error: null,
  });

  // Initialize and check installation
  useEffect(() => {
    const installed = isMetaMaskInstalled();
    setState(prev => ({ ...prev, isInstalled: installed }));

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        setState(prev => ({
          ...prev,
          isConnected: false,
          address: null,
          balance: null
        }));
      } else {
        // User switched accounts
        setState(prev => ({
          ...prev,
          isConnected: true,
          address: accounts[0],
        }));
        
        // Update balance for new account
        getBalance(accounts[0]).then(balance => {
          setState(prev => ({ ...prev, balance }));
        });
      }
    };

    // Listen for chain changes
    const handleChainChanged = (chainId: string) => {
      setState(prev => ({ ...prev, chainId }));
      
      // Refresh page as recommended by MetaMask
      window.location.reload();
    };

    if (installed && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setState(prev => ({
              ...prev,
              isConnected: true,
              address: accounts[0],
            }));
            
            // Get chain ID and balance
            Promise.all([
              getChainId(),
              getBalance(accounts[0])
            ]).then(([chainId, balance]) => {
              setState(prev => ({ ...prev, chainId, balance }));
            });
          }
        })
        .catch(console.error);
    }

    // Cleanup listeners
    return () => {
      if (installed && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Connect to MetaMask
  const connect = useCallback(async () => {
    if (!state.isInstalled) {
      toast({
        title: "MetaMask Not Installed",
        description: "Please install MetaMask extension to continue.",
        variant: "destructive",
      });
      setState(prev => ({ 
        ...prev, 
        error: "MetaMask is not installed" 
      }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const address = await connectMetaMask();
      
      if (address) {
        const [chainId, balance] = await Promise.all([
          getChainId(),
          getBalance(address)
        ]);
        
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          address,
          chainId,
          balance,
        }));
        
        toast({
          title: "Connected to MetaMask",
          description: `Connected to account ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      } else {
        setState(prev => ({ 
          ...prev, 
          isConnecting: false,
          error: "Connection rejected by user" 
        }));
      }
    } catch (error) {
      console.error("MetaMask connection error:", error);
      setState(prev => ({ 
        ...prev, 
        isConnecting: false,
        error: "Failed to connect to MetaMask" 
      }));
      
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask. Please try again.",
        variant: "destructive",
      });
    }
  }, [state.isInstalled, toast]);

  // Get formatted address for display
  const getFormattedAddress = useCallback(() => {
    if (!state.address) return '';
    return `${state.address.slice(0, 6)}...${state.address.slice(-4)}`;
  }, [state.address]);

  return {
    ...state,
    connect,
    getFormattedAddress
  };
}

export { useMetaMask };