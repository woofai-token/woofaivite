import React, { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";

const BACKEND_URL = "https://woofaiserver.onrender.com";

export default function PresaleForm() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Your presale receiving wallet (replace with your actual wallet address)
  const RECEIVER_WALLET = new PublicKey("GWkwfF8BbA591V4ZFTLDJJ9eRy5Mhp2Z9zNBNFvf6cgy");

  async function handleBuy(e) {
    e.preventDefault();

    if (!connected) {
      setStatus("Please connect your wallet first.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setStatus("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Creating transaction...");

      const lamports = Number(amount) * 1e9; // Convert SOL amount to lamports

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: RECEIVER_WALLET,
          lamports,
        })
      );

      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      setStatus("Sending transaction...");
      const signature = await sendTransaction(transaction, connection);

      setStatus("Waiting for confirmation...");
      await connection.confirmTransaction(signature, "confirmed");

      setStatus("Transaction confirmed. Verifying with backend...");

      // Call your backend to verify tx and distribute tokens
      const response = await fetch(`${BACKEND_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature,
          buyer: publicKey.toBase58(),
          amount: Number(amount),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("Purchase successful! Tokens will be sent shortly.");
      } else {
        setStatus(`Backend error: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      setStatus("Transaction failed or cancelled.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleBuy}
      style={{
        marginTop: 20,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <input
        type="number"
        placeholder="Amount of SOL to spend"
        value={amount}
        min="0.001"
        step="0.001"
        onChange={(e) => setAmount(e.target.value)}
        disabled={!connected || loading}
        style={{
          padding: 10,
          borderRadius: 6,
          border: "1px solid #0fef21",
          backgroundColor: "#000",
          color: "#0fef21",
          fontSize: 16,
          textAlign: "center",
        }}
      />
      <button
        type="submit"
        disabled={!connected || loading}
        style={{
          padding: "12px 20px",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#0fef21",
          color: "#000",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: 16,
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0cb813")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0fef21")}
      >
        {loading ? "Processing..." : "Buy WoofAi Tokens"}
      </button>
      <p
        style={{
          minHeight: 24,
          color: "#0fef21",
          fontWeight: "bold",
          marginTop: 10,
          fontSize: 14,
        }}
      >
        {status}
      </p>
    </form>
  );
}
