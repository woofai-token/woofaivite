import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";

import { 
  PhantomWalletAdapter, 
  SolflareWalletAdapter,
  // Explicitly import if you want to check for MWA
  BaseWalletAdapter 
} from "@solana/wallet-adapter-wallets";

const network = "https://mainnet.helius-rpc.com/?api-key=fabdaf9f-b1de-4a1b-bb03-58532838cea3";

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
].filter(wallet => {
  // Explicitly exclude any wallet that might be MWA
  const walletName = wallet.name.toLowerCase();
  return !walletName.includes('mobile') && !walletName.includes('mwa');
});

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
