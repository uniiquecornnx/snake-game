import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';
import './WalletConnect.css';

const WalletConnect = ({ onWalletConnected }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { connect, isLoading, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Find the injected connector (MetaMask)
      const injectedConnector = connectors.find(connector => connector.id === 'injected');
      if (injectedConnector) {
        await connect({ connector: injectedConnector });
      } else {
        console.error('No injected connector found');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Call onWalletConnected when address changes
  useEffect(() => {
    if (address && isConnected) {
      onWalletConnected(address);
    }
  }, [address, isConnected, onWalletConnected]);

  const handleDisconnect = () => {
    disconnect();
    onWalletConnected(null);
  };

  const switchToBase = () => {
    if (switchChain) {
      switchChain({ chainId: base.id });
    }
  };

  const getShortAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case base.id:
        return 'Base';
      case 1:
        return 'Ethereum';
      case 137:
        return 'Polygon';
      default:
        return `Chain ${chainId}`;
    }
  };

  if (isConnected && address) {
    return (
      <div className="wallet-connected">
        <div className="wallet-info">
          <div className="wallet-address">
            <span className="label">Connected:</span>
            <span className="address">{getShortAddress(address)}</span>
          </div>
          <div className="network-info">
            <span className="network">{getNetworkName(chainId)}</span>
            {chainId !== base.id && (
              <button onClick={switchToBase} className="switch-network-btn">
                Switch to Base
              </button>
            )}
          </div>
        </div>
        <button onClick={handleDisconnect} className="disconnect-btn">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      <div className="connect-header">
        <h2>🔗 Connect Wallet</h2>
        <p>Connect your wallet to play and compete on the global leaderboard!</p>
      </div>
      
      <div className="wallet-options">
        <button 
          onClick={handleConnect}
          disabled={isLoading || isConnecting}
          className="connect-btn"
        >
          {isLoading || isConnecting ? (
            <span>Connecting...</span>
          ) : (
            <>
              <span className="metamask-icon">🦊</span>
              <span>Connect MetaMask</span>
            </>
          )}
        </button>
        
        <div className="supported-networks">
          <h4>Supported Networks:</h4>
          <div className="network-list">
            <span className="network-item">🏗️ Base (Recommended)</span>
            <span className="network-item">⛓️ Ethereum</span>
            <span className="network-item">🔷 Polygon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect; 