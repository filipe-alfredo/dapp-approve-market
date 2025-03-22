
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import ConnectWallet from '@/components/ConnectWallet';
import TokenInfo from '@/components/TokenInfo';
import ApproveToken from '@/components/ApproveToken';
import BuyToken from '@/components/BuyToken';
import TransactionStatus from '@/components/TransactionStatus';
import Footer from '@/components/Footer';
import { connectWallet, getTokensAvailable, getTokensSold, setupAccountListeners, setupChainListeners } from '@/lib/web3';
import { TOKEN_PRICE } from '@/lib/constants';

type Step = 'connect' | 'approve' | 'buy' | 'success' | 'error';

const Index = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [tokensSold, setTokensSold] = useState('0');
  const [tokensAvailable, setTokensAvailable] = useState('0');
  const [tokenPrice, setTokenPrice] = useState(TOKEN_PRICE.toString());
  const [currentStep, setCurrentStep] = useState<Step>('connect');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [error, setError] = useState('');

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Set up listeners for account/chain changes
  useEffect(() => {
    const accountCleanup = setupAccountListeners(() => {
      window.location.reload();
    });
    
    const chainCleanup = setupChainListeners(() => {
      window.location.reload();
    });
    
    return () => {
      accountCleanup();
      chainCleanup();
    };
  }, []);

  // Fetch token data
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const [available, sold] = await Promise.all([
          getTokensAvailable(),
          getTokensSold()
        ]);
        
        setTokensAvailable(available);
        setTokensSold(sold);
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleConnectWallet = async () => {
    const newAccount = await connectWallet();
    if (newAccount) {
      setAccount(newAccount);
      setCurrentStep('buy');
    }
  };

  const handleBuyClick = (amount?: string) => {
    if (amount) {
      setPurchaseAmount(amount);
    }
    
    if (!account) {
      setCurrentStep('connect');
    } else {
      setCurrentStep('approve');
    }
  };

  const handleApproveComplete = () => {
    setCurrentStep('buy');
  };

  const handleBuyComplete = () => {
    setCurrentStep('success');
    // Refresh token data after purchase
    getTokensAvailable().then(setTokensAvailable);
    getTokensSold().then(setTokensSold);
  };

  const resetFlow = () => {
    setCurrentStep('buy');
    setPurchaseAmount('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar 
        account={account} 
        onConnectWallet={handleConnectWallet} 
      />
      
      <main className="flex-grow">
        <Hero 
          tokensSold={tokensSold} 
          tokensAvailable={tokensAvailable}
          onBuyNow={() => handleBuyClick('100')}
        />
        
        <TokenInfo 
          tokenPrice={tokenPrice}
          tokensSold={tokensSold}
          tokensAvailable={tokensAvailable}
        />
        
        <section id="buy" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-app-dark-gray sm:text-4xl">
                Purchase Tokens
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-app-medium-gray">
                Join our token sale and be part of the future
              </p>
            </div>
            
            {/* Step-based content */}
            <div className="max-w-md mx-auto">
              {!account && currentStep === 'connect' && (
                <ConnectWallet onConnect={(acc) => {
                  setAccount(acc);
                  setCurrentStep('approve');
                }} />
              )}
              
              {account && currentStep === 'approve' && (
                <ApproveToken 
                  account={account} 
                  onApproveComplete={handleApproveComplete}
                  purchaseAmount={purchaseAmount}
                />
              )}
              
              {account && currentStep === 'buy' && (
                <BuyToken 
                  account={account}
                  tokenPrice={tokenPrice}
                  onBuyComplete={handleBuyComplete}
                  onBack={() => setCurrentStep('approve')}
                  initialAmount={purchaseAmount}
                />
              )}
              
              {currentStep === 'success' && (
                <TransactionStatus 
                  success={true}
                  amount={purchaseAmount}
                  onDone={resetFlow}
                />
              )}
              
              {currentStep === 'error' && (
                <TransactionStatus 
                  success={false}
                  error={error}
                  onDone={resetFlow}
                />
              )}
            </div>
          </div>
        </section>
        
        {/* Add About section */}
        <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-app-dark-gray sm:text-4xl">
                About Our Project
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-app-medium-gray">
                Innovative blockchain technology for the future
              </p>
            </div>
            
            <div className="glass-card p-8 max-w-3xl mx-auto">
              <p className="text-app-dark-gray mb-4">
                Our platform leverages cutting-edge blockchain technology to provide a secure, transparent, and efficient ecosystem for digital transactions. Built on Ethereum, our token offers unique features that set it apart from others in the market.
              </p>
              <p className="text-app-dark-gray mb-4">
                The initial coin offering (ICO) represents an opportunity to be part of this revolutionary project from the beginning. By participating in our token sale, you're not just purchasing digital assets – you're investing in the future of blockchain technology.
              </p>
              <p className="text-app-dark-gray">
                Our team of experienced developers and blockchain experts has designed a system that addresses common pain points in the industry, offering solutions that prioritize user experience, security, and scalability.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
