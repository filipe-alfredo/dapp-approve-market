
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatAmount, approveTokens, getAllowance } from '@/lib/web3';
import { ICO_CONTRACT_ADDRESS, TOKEN_SYMBOL } from '@/lib/constants';
import { Lock } from 'lucide-react';

interface ApproveTokenProps {
  account: string;
  onApproveComplete: () => void;
  purchaseAmount: string;
}

const ApproveToken: React.FC<ApproveTokenProps> = ({ 
  account, 
  onApproveComplete,
  purchaseAmount
}) => {
  const [amount, setAmount] = useState(purchaseAmount);
  const [allowance, setAllowance] = useState('0');
  const [isApproving, setIsApproving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (purchaseAmount) {
      setAmount(purchaseAmount);
    }
  }, [purchaseAmount]);

  useEffect(() => {
    const fetchAllowance = async () => {
      if (account) {
        setIsLoading(true);
        try {
          const result = await getAllowance(account, ICO_CONTRACT_ADDRESS);
          setAllowance(result);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAllowance();
  }, [account]);

  const handleApprove = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsApproving(true);
    try {
      const success = await approveTokens(ICO_CONTRACT_ADDRESS, amount);
      if (success) {
        const newAllowance = await getAllowance(account, ICO_CONTRACT_ADDRESS);
        setAllowance(newAllowance);
        onApproveComplete();
      }
    } finally {
      setIsApproving(false);
    }
  };

  const hasEnoughAllowance = parseFloat(allowance) >= parseFloat(amount || '0');

  return (
    <Card className="glass-card w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Approve Tokens</CardTitle>
        <CardDescription>
          Allow the smart contract to transfer tokens on your behalf
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Amount to Approve ({TOKEN_SYMBOL})
            </label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/80"
            />
          </div>
          
          {!isLoading && (
            <div className="text-sm text-app-medium-gray">
              Current Allowance: <span className="font-medium">{formatAmount(allowance)} {TOKEN_SYMBOL}</span>
            </div>
          )}

          {hasEnoughAllowance ? (
            <Button
              className="w-full bg-green-500 hover:bg-green-600"
              onClick={onApproveComplete}
            >
              Continue to Purchase
            </Button>
          ) : (
            <Button
              className="w-full bg-app-accent-blue hover:bg-app-accent-blue/90"
              onClick={handleApprove}
              disabled={isApproving || isLoading || !amount || parseFloat(amount) <= 0}
            >
              {isApproving ? (
                <>
                  <div className="loader mr-2"></div>
                  Approving...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Approve Tokens
                </>
              )}
            </Button>
          )}
          
          <p className="text-xs text-app-medium-gray mt-4">
            Note: This transaction requires gas fees and will trigger a confirmation in your wallet
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApproveToken;
