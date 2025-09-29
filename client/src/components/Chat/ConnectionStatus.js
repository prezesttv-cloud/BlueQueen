import React from 'react';
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import './ConnectionStatus.css';

const ConnectionStatus = ({ isConnected, connectionError, onReconnect }) => {
  if (isConnected && !connectionError) {
    return (
      <div className="connection-status connected">
        <Wifi size={14} />
        <span>Połączono z Blue Queen</span>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="connection-status error">
        <AlertTriangle size={14} />
        <span>{connectionError}</span>
        <button 
          className="reconnect-btn"
          onClick={onReconnect}
          title="Spróbuj ponownie"
        >
          <RefreshCw size={12} />
          Połącz ponownie
        </button>
      </div>
    );
  }

  return (
    <div className="connection-status disconnected">
      <WifiOff size={14} />
      <span>Łączenie z Blue Queen...</span>
      <div className="connection-spinner"></div>
    </div>
  );
};

export default ConnectionStatus;