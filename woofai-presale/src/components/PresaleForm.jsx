// Same imports...
import React, { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";

const BACKEND_URL = "https://woofaiserver.onrender.com";
const CONVERSION_RATE = 1000000; // 1 SOL = 1,000,000 WFAI
const RECEIVER_WALLET = new PublicKey("GWkwfF8BbA591V4ZFTLDJJ9eRy5Mhp2Z9zNBNFvf6cgy");

export default function PresaleForm() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const [solAmount, setSolAmount] = useState("");
  const [wfaiAmount, setWfaiAmount] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const updateFromSol = (value) => {
    setSolAmount(value);
    const sol = parseFloat(value);
    if (!isNaN(sol)) setWfaiAmount((sol * CONVERSION_RATE).toFixed(0));
    else setWfaiAmount("");
  };

  const updateFromWfai = (value) => {
    setWfaiAmount(value);
    const wfai = parseFloat(value);
    if (!isNaN(wfai)) setSolAmount((wfai / CONVERSION_RATE).toFixed(4));
    else setSolAmount("");
  };

  async function handleBuy(e) {
    e.preventDefault();
    if (!connected) return setStatus("Please connect your wallet first.");
    const sol = parseFloat(solAmount);
    if (!sol || isNaN(sol) || sol <= 0) return setStatus("Enter a valid SOL amount.");

    try {
      setLoading(true);
      setStatus("Creating transaction...");
      const lamports = sol * 1e9;

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
      const response = await fetch(`${BACKEND_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature, buyer: publicKey.toBase58(), amount: sol }),
      });

      const data = await response.json();
      setStatus(response.ok && data.success ? "✅ Purchase successful! Tokens sent." : `❌ Backend error: ${data.error || "Unknown error"}`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Transaction failed or cancelled.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleBuy} style={formStyle}>
      <input
        type="number"
        placeholder="SOL amount"
        value={solAmount}
        min="0.001"
        step="0.001"
        inputMode="decimal"
        disabled={!connected || loading}
        onChange={(e) => updateFromSol(e.target.value)}
        style={inputStyle}
      />
      <input
        type="number"
        placeholder="WoofAi Token amount"
        value={wfaiAmount}
        step="1"
        min="1"
        inputMode="numeric"
        disabled={!connected || loading}
        onChange={(e) => updateFromWfai(e.target.value)}
        style={inputStyle}
      />
      <button
        type="submit"
        disabled={!connected || loading}
        style={buttonStyle}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0cb813")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0fef21")}
      >
        {loading ? "Processing..." : "Buy WoofAi Tokens"}
      </button>
      <p style={statusStyle}>{status}</p>
    </form>
  );
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  fontFamily: "'Orbitron', sans-serif",
};

const inputStyle = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #0fef21",
  backgroundColor: "#000",
  color: "#0fef21",
  fontSize: 16,
  textAlign: "center",
  boxShadow: "0 0 8px #0fef21",
};

const buttonStyle = {
  padding: "14px 24px",
  borderRadius: 8,
  border: "none",
  backgroundColor: "#0fef21",
  color: "#000",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: 16,
  transition: "0.3s ease",
  fontFamily: "'Orbitron', sans-serif",
  boxShadow: "0 0 10px #0fef21",
};

const statusStyle = {
  minHeight: 24,
  color: "#0fef21",
  fontWeight: "bold",
  marginTop: 10,
  fontSize: 14,
  textAlign: "center",
};
