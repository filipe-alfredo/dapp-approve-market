
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TOKEN_NAME, TOKEN_SYMBOL } from '@/lib/constants';

interface TokenInfoProps {
  tokenPrice: string;
  tokensSold: string;
  tokensAvailable: string;
}

const TokenInfo: React.FC<TokenInfoProps> = ({ 
  tokenPrice, 
  tokensSold, 
  tokensAvailable 
}) => {
  const infoItems = [
    { label: 'Token Name', value: TOKEN_NAME },
    { label: 'Token Symbol', value: TOKEN_SYMBOL },
    { label: 'Token Price', value: `${tokenPrice} ETH` },
    { label: 'Tokens Sold', value: parseFloat(tokensSold).toLocaleString() },
    { label: 'Tokens Available', value: parseFloat(tokensAvailable).toLocaleString() },
    { label: 'Minimum Purchase', value: '10 Tokens' },
    { label: 'Maximum Purchase', value: '10,000 Tokens' },
  ];

  return (
    <section id="tokenomics" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-app-dark-gray sm:text-4xl">
            Token Information
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-app-medium-gray">
            Everything you need to know about our token offering
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="glass-card p-8 animate-fade-in">
            <h3 className="text-xl font-medium text-app-dark-gray mb-6">Token Details</h3>
            
            <div className="space-y-4 stagger-animate">
              {infoItems.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center">
                    <span className="text-app-medium-gray">{item.label}</span>
                    <span className="font-medium text-app-dark-gray">{item.value}</span>
                  </div>
                  {index < infoItems.length - 1 && <Separator className="mt-2" />}
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-medium text-app-dark-gray mb-6">Token Distribution</h3>
            
            <div className="space-y-6 stagger-animate">
              {[
                { category: 'Public Sale', percentage: 40, color: 'bg-app-accent-blue' },
                { category: 'Team & Advisors', percentage: 20, color: 'bg-blue-400' },
                { category: 'Marketing', percentage: 15, color: 'bg-blue-300' },
                { category: 'Reserve', percentage: 15, color: 'bg-blue-200' },
                { category: 'Ecosystem', percentage: 10, color: 'bg-blue-100' }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-app-dark-gray">{item.category}</span>
                    <span className="text-sm font-medium text-app-medium-gray">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenInfo;
