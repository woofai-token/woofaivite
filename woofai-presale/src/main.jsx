import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";

// Load RPC endpoint from Vite environment variable
const network = import.meta.env.VITE_SOLANA_RPC_URL;

// Import wallet adapters
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { MobileWalletAdapter } from "@solana-mobile/wallet-adapter-mobile";

// Detect mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Wallet list including Mobile Wallet Adapter
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new MobileWalletAdapter({
    appIdentity: {
      name: "WoofAI Presale"
    }
  })
];

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConnectionProvider endpoint={network}>
    <WalletProvider wallets={wallets} autoConnect={!isMobile}>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);
