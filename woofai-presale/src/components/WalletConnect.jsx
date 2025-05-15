import React, { useMemo, useCallback, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  SolletExtensionWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import TokenomicsChart from "./TokenomicsChart";

const endpoint = clusterApiUrl("devnet"); // Change to mainnet-beta if needed
const backendURL = "https://woofaiserver.onrender.com";

function PresaleForm() {
  const wallet = useWallet();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const onBuy = useCallback(async () => {
    if (!wallet.connected) {
      setStatus("Please connect your wallet first.");
      return;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      setStatus("Please enter a valid amount.");
      return;
    }

    try {
      setStatus("Creating transaction...");

      const connection = new ConnectionProvider({ endpoint }).connection;

      // Build transfer transaction
      const recipient = new PublicKey("YOUR_TOKEN_RECEIVER_WALLET_ADDRESS"); // replace with your receiving wallet address
      const lamports = Math.round(parseFloat(amount) * 1e9); // 1 SOL = 1e9 lamports

      let transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipient,
          lamports,
        })
      );

      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;

      const signedTx = await wallet.signTransaction(transaction);

      const txid = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(txid, "confirmed");

      setStatus(`Transaction sent: ${txid}. Verifying with backend...`);

      // Call backend to verify and issue tokens
      const res = await fetch(`${backendURL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature: txid,
          buyerAddress: wallet.publicKey.toBase58(),
          amount,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setStatus("Purchase successful! Tokens will be distributed shortly.");
      } else {
        setStatus(`Backend verification failed: ${json.message || "Unknown error"}`);
      }
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  }, [wallet, amount]);

  return (
    <div className="card">
      <h2>WoofAi Presale</h2>
      <WalletMultiButton />
      <div className="input-group">
        <label>Amount (SOL):</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter SOL to spend"
          disabled={!wallet.connected}
        />
      </div>
      <button onClick={onBuy} disabled={!wallet.connected}>
        Buy Tokens
      </button>
      <p className="status">{status}</p>
      <TokenomicsChart />
    </div>
  );
}

function App() {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new SolletExtensionWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="container">
            <h1>WoofAi Token Presale</h1>
            <PresaleForm />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
