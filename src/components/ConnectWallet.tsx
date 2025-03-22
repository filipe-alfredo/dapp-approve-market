
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { connectWallet } from '@/lib/web3';

interface ConnectWalletProps {
  onConnect: (account: string) => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const account = await connectWallet();
      if (account) {
        onConnect(account);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="glass-card w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Connect Your Wallet</CardTitle>
        <CardDescription className="text-center">
          Connect your wallet to participate in the token sale
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full py-6 bg-app-accent-blue hover:bg-app-accent-blue/90 text-white flex items-center justify-center button-transition"
        >
          {isConnecting ? (
            <>
              <div className="loader mr-2"></div>
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </>
          )}
        </Button>
        
        <p className="mt-4 text-sm text-app-medium-gray text-center">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </p>
        
        <div className="mt-6 w-full grid grid-cols-3 gap-2">
          {['MetaMask', 'WalletConnect', 'Coinbase'].map((wallet) => (
            <div key={wallet} className="text-center p-3 rounded-lg border border-gray-200 hover:border-app-accent-blue hover:bg-gray-50 cursor-pointer transition-all">
              <div className="text-xs font-medium">{wallet}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectWallet;
