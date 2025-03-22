
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { buyTokens } from '@/lib/web3';
import { TOKEN_SYMBOL } from '@/lib/constants';
import { ArrowRight, ShoppingCart } from 'lucide-react';

interface BuyTokenProps {
  account: string;
  tokenPrice: string;
  onBuyComplete: () => void;
  onBack: () => void;
  initialAmount?: string;
}

const BuyToken: React.FC<BuyTokenProps> = ({ 
  account, 
  tokenPrice, 
  onBuyComplete, 
  onBack,
  initialAmount = ''
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [isBuying, setIsBuying] = useState(false);
  
  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
    }
  }, [initialAmount]);

  const calculateEthCost = () => {
    if (!amount || !tokenPrice) return '0';
    return (parseFloat(amount) * parseFloat(tokenPrice)).toFixed(6);
  };

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsBuying(true);
    try {
      const success = await buyTokens(amount);
      if (success) {
        onBuyComplete();
      }
    } finally {
      setIsBuying(false);
    }
  };

  const ethCost = calculateEthCost();

  return (
    <Card className="glass-card w-full max-w-md mx-auto animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Purchase Tokens</CardTitle>
        <CardDescription>
          You're about to purchase {TOKEN_SYMBOL} tokens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({TOKEN_SYMBOL})</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/80"
            />
          </div>
          
          <div className="glass-card p-4 bg-white/30">
            <div className="flex justify-between mb-2">
              <span className="text-app-medium-gray">Token Price:</span>
              <span className="font-medium">{tokenPrice} ETH</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-app-medium-gray">Quantity:</span>
              <span className="font-medium">{amount || '0'} {TOKEN_SYMBOL}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between mt-2">
              <span className="text-app-dark-gray font-medium">Total Cost:</span>
              <span className="text-app-dark-gray font-medium">{ethCost} ETH</span>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              className="flex-1 bg-app-accent-blue hover:bg-app-accent-blue/90"
              onClick={handleBuy}
              disabled={isBuying || !amount || parseFloat(amount) <= 0}
            >
              {isBuying ? (
                <>
                  <div className="loader mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Tokens
                </>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-app-medium-gray mt-4">
            Note: This transaction requires gas fees and will trigger a confirmation in your wallet
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuyToken;
