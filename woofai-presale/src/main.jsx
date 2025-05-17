import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

const network = "https://mainnet.helius-rpc.com/?api-key=fabdaf9f-b1de-4a1b-bb03-58532838cea3";

// 1. BLOCK MOBILE WALLETS WITHOUT BREAKING PHANTOM
if (typeof window !== "undefined") {
  // Keep this minimal to avoid interfering with Phantom
  window.walletRouter = {
    disableWalletStandard: true,
    disableMobileWalletAdapter: true
  };
  
  // Preserve the original solana object if it exists
  const originalSolana = window.solana;
  Object.defineProperty(window, 'solana', {
    get: () => originalSolana,
    set: (value) => {
      // Only allow setting if it's not a mobile wallet
      if (!value?.isMobile) {
        originalSolana = value;
      }
    }
  });
}

// 2. WALLET SETUP WITH PROPER ERROR HANDLING
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

// 3. IMPROVED WALLET PROVIDER CONFIG
ReactDOM.createRoot(document.getElementById("root")).render(
  <ConnectionProvider endpoint={network}>
    <WalletProvider 
      wallets={wallets}
      autoConnect={false}
      onError={(error) => console.error("Wallet error:", error)}
    >
      <WalletModalProvider
        featuredWallets={2}
        // Explicitly exclude any mobile wallets
        wallets={wallets.filter(w => !w.name.toLowerCase().includes('mobile'))}
      >
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);
