
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { TOKEN_SYMBOL } from '@/lib/constants';

interface TransactionStatusProps {
  success: boolean;
  amount?: string;
  onDone: () => void;
  error?: string;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ 
  success, 
  amount, 
  onDone,
  error
}) => {
  return (
    <Card className="glass-card w-full max-w-md mx-auto animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {success ? 'Transaction Successful!' : 'Transaction Failed'}
        </CardTitle>
        <CardDescription className="text-center">
          {success 
            ? `Your purchase of ${amount} ${TOKEN_SYMBOL} tokens has been completed`
            : 'We encountered an issue processing your transaction'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {success ? (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-pulse-light">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            
            <p className="text-center text-app-medium-gray mb-6">
              The tokens have been transferred to your wallet. Thank you for participating in our token sale!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <p className="text-center text-app-medium-gray mb-2">
              {error || 'Something went wrong with your transaction. Please try again.'}
            </p>
          </div>
        )}
        
        <Button
          onClick={onDone}
          className="mt-6 bg-app-accent-blue hover:bg-app-accent-blue/90 w-full"
        >
          {success ? 'View Dashboard' : 'Try Again'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default TransactionStatus;
