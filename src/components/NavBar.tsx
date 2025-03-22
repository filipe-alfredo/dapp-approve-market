
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatAddress } from '@/lib/web3';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface NavBarProps {
  account: string | null;
  onConnectWallet: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  account,
  onConnectWallet
}) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-card bg-opacity-70 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-semibold text-app-accent-blue">Token ICO</span>
            </div>
          </div>
          
          {!isMobile && (
            <div className="flex items-center space-x-4">
              <a href="#about" className="text-app-dark-gray hover:text-app-accent-blue button-transition px-3 py-2">
                About
              </a>
              <a href="#tokenomics" className="text-app-dark-gray hover:text-app-accent-blue button-transition px-3 py-2">
                Tokenomics
              </a>
              <a href="#buy" className="text-app-dark-gray hover:text-app-accent-blue button-transition px-3 py-2">
                Buy Tokens
              </a>
              
              {account ? (
                <Button 
                  className="ml-4 bg-app-accent-blue text-white hover:bg-app-accent-blue/90"
                >
                  {formatAddress(account)}
                </Button>
              ) : (
                <Button 
                  onClick={onConnectWallet}
                  className="ml-4 bg-app-accent-blue text-white hover:bg-app-accent-blue/90"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          )}
          
          {isMobile && (
            <div className="flex items-center">
              {account && (
                <Button 
                  className="mr-2 bg-app-accent-blue text-white hover:bg-app-accent-blue/90"
                  size="sm"
                >
                  {formatAddress(account)}
                </Button>
              )}
              
              <button
                className="p-2 rounded-md text-app-dark-gray"
                onClick={toggleMenu}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="glass-card border-t border-app-glass-border px-2 pb-3 pt-2 animate-fade-in">
          <div className="space-y-1 px-3">
            <a
              href="#about"
              className="block px-3 py-3 rounded-md text-base font-medium text-app-dark-gray hover:text-app-accent-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#tokenomics"
              className="block px-3 py-3 rounded-md text-base font-medium text-app-dark-gray hover:text-app-accent-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Tokenomics
            </a>
            <a
              href="#buy"
              className="block px-3 py-3 rounded-md text-base font-medium text-app-dark-gray hover:text-app-accent-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Buy Tokens
            </a>
            
            {!account && (
              <Button 
                onClick={() => {
                  onConnectWallet();
                  setIsMenuOpen(false);
                }}
                className="w-full mt-2 bg-app-accent-blue text-white hover:bg-app-accent-blue/90"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
