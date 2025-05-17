import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

const network = "https://mainnet.helius-rpc.com/?api-key=fabdaf9f-b1de-4a1b-bb03-58532838cea3";

// 1. COMPLETELY DISABLE WALLET STANDARD AND MWA
if (typeof window !== "undefined") {
  // Nuclear option 1: Disable all wallet auto-discovery
  window.walletRouter = {
    disableWalletStandard: true,
    disableMobileWalletAdapter: true,
    walletStandardOverride: () => []
  };

  // Nuclear option 2: Prevent any mobile-related wallet code from loading
  Object.defineProperty(window, 'solana', {
    writable: false,
    value: {
      isPhantom: true, // Trick browsers into thinking Phantom is available
      isSolflare: true // Same for Solflare
    }
  });

  // Nuclear option 3: Delete mobile wallet references
  delete window.solanaMobile;
  delete window.ReactNativeWebView;
}

// 2. STRICT WALLET FILTERING
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
].filter(wallet => {
  // Double-check we only allow Phantom and Solflare
  return ['Phantom', 'Solflare'].includes(wallet.name);
});

// 3. FORCE CLEAN ENVIRONMENT
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  // Extra mobile-specific protections
  window.localStorage.removeItem('walletAdapter');
  window.sessionStorage.removeItem('walletAdapter');
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConnectionProvider endpoint={network}>
    <WalletProvider 
      wallets={wallets} 
      autoConnect={false} // Disable auto-connect for maximum control
      onError={(error) => {
        // Log any wallet errors
        console.error('Wallet Error:', error);
      }}
    >
      <WalletModalProvider
        featuredWallets={2} // Only show our 2 wallets
      >
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);
