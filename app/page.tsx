'use client';

import { useEffect, useState, useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { 
  Swap, 
  SwapAmountInput, 
  SwapToggleButton, 
  SwapButton, 
  SwapMessage, 
  SwapToast,
  SwapSettings,
  SwapSettingsSlippageDescription,
  SwapSettingsSlippageInput,
  SwapSettingsSlippageTitle
} from '@coinbase/onchainkit/swap';
import type { Token } from '@coinbase/onchainkit/token';
import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownBasename, 
  WalletDropdownDisconnect, 
  WalletDropdownFundLink, 
  WalletDropdownLink 
} from '@coinbase/onchainkit/wallet';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { motion } from 'motion/react';
import { Coins, Info, ArrowUpRight } from 'lucide-react';

const ETHToken: Token = {
  address: '',
  chainId: 8453,
  decimals: 18,
  name: 'Ethereum',
  symbol: 'ETH',
  image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab839523a0272847823353c618ccdaac9801ba27165158d063f99443e11f845707762bb9007f33923933c069707b951ee1b898129766/asset_icons/8d9990caa6405370de79344445353e6d156641e77fba147326df89d5a6c1e920.png',
};

const USDCToken: Token = {
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  chainId: 8453,
  decimals: 6,
  name: 'USDC',
  symbol: 'USDC',
  image: 'https://dynamic-assets.coinbase.com/3c15df5e2ca7d70ebadd8df5ad0399178b81eb0d2193b4a203a950df3f0b4c2b960a02ba4d3393962664979e2730ca78912759e66cb5dcf5697669818a7c2936/asset_icons/97ef979703ec88079543663b1b919379493f06059638f24419ad2040c1aacdc4.png',
};

const CBBTCToken: Token = {
  address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
  chainId: 8453,
  decimals: 8,
  name: 'cbBTC',
  symbol: 'cbBTC',
  image: 'https://dynamic-assets.coinbase.com/00c25cc2-ca97-408d-8d4e-1282c0f68d37/de1606d2-284a-4a2e-8e68-088820f66b74.png',
};

const DEPLOYED_TOKENS: Token[] = [ETHToken, USDCToken, CBBTCToken];

export default function SwapPortal() {
  const { address, isConnected } = useAccount();
  const [isReady, setIsReady] = useState(false);
  const [fromToken, setFromToken] = useState<Token>(ETHToken);
  const [amountValues, setAmountValues] = useState({ from: '', to: '' });

  const { data: balanceData } = useBalance({
    address,
    token: fromToken.address ? (fromToken.address as `0x${string}`) : undefined,
  });

  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
      } catch (e) {
        console.error('Farcaster SDK not ready', e);
      }
      setIsReady(true);
    };
    init();
  }, []);

  const handleMaxClick = useCallback(() => {
    if (balanceData) {
      const formattedBalance = formatUnits(balanceData.value, balanceData.decimals);
      setAmountValues(prev => ({ ...prev, from: formattedBalance }));
    }
  }, [balanceData]);

  const handleAmountChange = useCallback((values: { from: string; to: string }) => {
    setAmountValues(values);
  }, []);

  const handleFromChange = useCallback((token: Token) => {
    setFromToken(token);
  }, []);

  if (!isReady) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      
      {/* Header / Wallet Section */}
      <div className="absolute top-4 right-4 z-50">
        <Wallet>
          <ConnectWallet className="!bg-blue-600 hover:!bg-blue-500 !text-white !rounded-full transition-all">
            <span className="font-medium">Connect</span>
          </ConnectWallet>
          <WalletDropdown>
            <WalletDropdownBasename />
            <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
              Go to Wallet
            </WalletDropdownLink>
            <WalletDropdownFundLink />
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] space-y-6"
      >
        {/* Hero Section */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-2">
            <Coins className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Base <span className="text-blue-500">Swap</span>
          </h1>
          <p className="text-slate-400 max-w-[300px] mx-auto text-sm">
            Swap assets instantly on the most efficient L2. Powered by OnchainKit.
          </p>
        </div>

        {/* Swap Container */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[32px] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-[28px] shadow-2xl">
            <Swap 
              title="Swap Portal" 
              className="!bg-transparent !p-0 !border-0 !shadow-none"
              from={DEPLOYED_TOKENS}
              to={DEPLOYED_TOKENS}
              amountValues={amountValues}
              onAmountChange={handleAmountChange}
              onFrom={handleFromChange}
            >
              <div className="space-y-3 text-slate-50">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-400">Sell</span>
                    {isConnected && balanceData && (
                      <button 
                        onClick={handleMaxClick}
                        className="text-[10px] font-bold bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-md hover:bg-blue-600/40 transition-colors uppercase tracking-wider h-5 flex items-center"
                      >
                        Max
                      </button>
                    )}
                  </div>
                  <SwapSettings>
                    <SwapSettingsSlippageTitle className="text-slate-50">Slippage</SwapSettingsSlippageTitle>
                    <SwapSettingsSlippageDescription className="text-slate-400">
                      The maximum price movement you&apos;re willing to accept.
                    </SwapSettingsSlippageDescription>
                    <SwapSettingsSlippageInput className="bg-slate-800 border-slate-700 text-slate-50" />
                  </SwapSettings>
                </div>
                
                <SwapAmountInput
                  label="Sell"
                  swappableTokens={DEPLOYED_TOKENS} 
                  type="from"
                  className="!bg-slate-800/50 !border-slate-700/50 !rounded-2xl !p-4 hover:!border-blue-500/30 transition-colors"
                />
                
                <div className="flex justify-center -my-4 relative z-10">
                  <SwapToggleButton className="!bg-blue-600 !border-slate-900 !rounded-full !p-2 hover:!scale-110 !transition-transform border-4 shadow-lg text-white" />
                </div>

                <div className="flex justify-between items-center px-1 pt-2">
                  <span className="text-sm font-medium text-slate-400">Buy</span>
                </div>

                <SwapAmountInput
                  label="Buy"
                  swappableTokens={DEPLOYED_TOKENS}
                  type="to"
                  className="!bg-slate-800/50 !border-slate-700/50 !rounded-2xl !p-4 hover:!border-blue-500/30 transition-colors"
                />

                <div className="pt-4">
                  {!isConnected ? (
                    <div className="text-center p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <p className="text-xs text-blue-400 flex items-center justify-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />
                        Please connect your wallet to start swapping
                      </p>
                    </div>
                  ) : (
                    <SwapButton className="!bg-blue-600 hover:!bg-blue-500 !text-white !font-bold !py-4 !rounded-2xl !transition-all shadow-lg shadow-blue-900/20" />
                  )}
                </div>
                
                <SwapMessage className="!text-slate-400 !text-xs !bg-transparent !p-2" />
                <SwapToast />
              </div>
            </Swap>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex justify-center gap-6 pt-4">
          <a href="https://docs.base.org" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Base Docs
          </a>
          <a href="https://onchainkit.xyz" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            OnchainKit
          </a>
        </div>
      </motion.div>
    </main>
  );
}
