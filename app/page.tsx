'use client';

import { useEffect, useState } from 'react';
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
import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownBasename, 
  WalletDropdownDisconnect, 
  WalletDropdownFundLink, 
  WalletDropdownLink 
} from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';
import { motion } from 'motion/react';
import { Coins, Info, ArrowUpRight } from 'lucide-react';

export default function SwapPortal() {
  const { isConnected } = useAccount();
  const [isReady, setIsReady] = useState(false);

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
            <Swap title="Swap Portal" className="!bg-transparent !p-0 !border-0 !shadow-none">
              <div className="space-y-3 text-slate-50">
                <div className="flex justify-between items-center px-1">
                  <span className="text-sm font-medium text-slate-400">Sell</span>
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
                  swappableTokens={[]} 
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
                  swappableTokens={[]}
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
