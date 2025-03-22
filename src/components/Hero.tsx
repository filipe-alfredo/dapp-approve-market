
import React, { useEffect, useRef } from 'react';
import { TOKEN_NAME, TOKEN_SYMBOL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  tokensSold: string;
  tokensAvailable: string;
  onBuyNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ tokensSold, tokensAvailable, onBuyNow }) => {
  const progressRef = useRef<HTMLDivElement>(null);
  
  const progressPercentage = tokensAvailable && tokensSold 
    ? Math.min(100, (parseFloat(tokensSold) / parseFloat(tokensAvailable)) * 100)
    : 0;
  
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${progressPercentage}%`;
    }
  }, [progressPercentage]);

  return (
    <div className="relative min-h-screen pt-16 pb-10 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-mesh bg-mesh opacity-40 pointer-events-none" />
      
      <div className="text-center max-w-3xl mx-auto z-10 slide-up-fade-in">
        <div className="mb-4 inline-block px-3 py-1 rounded-full bg-app-accent-blue/10 text-app-accent-blue text-sm font-medium">
          Initial Coin Offering
        </div>
        
        <h1 className="text-4xl font-bold text-app-dark-gray sm:text-5xl md:text-6xl mb-6 text-balance">
          The Future of <span className="text-app-accent-blue">Digital Assets</span> Starts Here
        </h1>
        
        <p className="mt-3 text-base text-app-medium-gray sm:mt-5 sm:text-lg max-w-xl mx-auto text-balance">
          {TOKEN_NAME} ({TOKEN_SYMBOL}) is a revolutionary digital token designed to transform the way we interact with blockchain technology.
        </p>
        
        <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center">
          <div className="rounded-md shadow">
            <Button
              onClick={onBuyNow}
              className="w-full flex items-center justify-center px-8 py-6 text-base font-medium rounded-lg text-white bg-app-accent-blue hover:bg-app-accent-blue/90 md:py-6 md:text-lg md:px-10 button-transition"
            >
              Buy Tokens Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="mt-12 sm:mt-16">
          <div className="glass-card p-6 max-w-md mx-auto">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-app-dark-gray">ICO Progress</span>
              <span className="text-sm font-medium text-app-accent-blue">{progressPercentage.toFixed(2)}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                ref={progressRef} 
                className="bg-app-accent-blue h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '0%' }}
              ></div>
            </div>
            
            <div className="flex justify-between mt-2 text-xs text-app-medium-gray">
              <span>{parseFloat(tokensSold).toLocaleString()} {TOKEN_SYMBOL}</span>
              <span>{parseFloat(tokensAvailable).toLocaleString()} {TOKEN_SYMBOL}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
