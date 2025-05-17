import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";

import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

const network = "https://mainnet.helius-rpc.com/?api-key=fabdaf9f-b1de-4a1b-bb03-58532838cea3";

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  // Add this dummy adapter to block Wallet Standard (which includes MWA)
  {
    name: 'DisableWalletStandard',
    icon: '',
    readyState: 'Unsupported',
    connect: async () => {},
    disconnect: async () => {},
    supportedTransactionVersions: new Set(['legacy', 0]),
  }
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
