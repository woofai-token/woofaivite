import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

const network = "https://mainnet.helius-rpc.com/?api-key=fabdaf9f-b1de-4a1b-bb03-58532838cea3";

// NUCLEAR OPTION - Completely disable Wallet Standard and MWA
if (typeof window !== "undefined") {
  // Disable Wallet Standard
  window.walletRouter = {
    disableWalletStandard: true,
    disableMobileWalletAdapter: true,
  };
  
  // Monkey-patch to prevent MWA injection
  const originalImport = window.import;
  window.import = function(module) {
    if (module.includes('@solana-mobile')) {
      return Promise.reject(new Error('Mobile Wallet Adapter disabled'));
    }
    return originalImport.apply(this, arguments);
  };
}

// ONLY the wallets we explicitly want
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConnectionProvider endpoint={network}>
    <WalletProvider wallets={wallets} autoConnect={!isMobile}>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);
