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

    if (!connected || !publicKey) {
      setStatus("❌ Please connect your wallet first.");
      return;
    }

    const sol = parseFloat(solAmount);
    if (!sol || isNaN(sol) || sol <= 0) {
      setStatus("❌ Enter a valid SOL amount.");
      return;
    }

    try {
      setLoading(true);
      setStatus("⏳ Creating transaction...");

      const lamports = sol * 1e9;
      const blockhashInfo = await connection.getLatestBlockhash("finalized");

      const transaction = new Transaction({
        feePayer: publicKey,
        recentBlockhash: blockhashInfo.blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: RECEIVER_WALLET,
          lamports,
        })
      );

      // Optional: simulate transaction logs
      try {
        const simulation = await connection.simulateTransaction(transaction);
        if (simulation.value.logs) {
          console.log("Simulation logs:", simulation.value.logs);
        }
      } catch (simErr) {
        console.warn("Simulation warning (continuing):", simErr.message);
      }

      setStatus("🚀 Sending transaction...");
      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });

      setStatus("⏳ Confirming transaction...");
      await connection.confirmTransaction(
        {
          signature,
          ...blockhashInfo,
        },
        "confirmed"
      );

      setStatus("✅ Transaction confirmed. Verifying with backend...");

      const response = await fetch(`${BACKEND_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature,
          buyer: publicKey.toBase58(),
          amount: sol,
        }),
      });

      const data = await response.json();
      setStatus(
        response.ok && data.success
          ? "🎉 Purchase successful! Tokens sent."
          : `❌ Backend error: ${data.error || "Unknown error"}`
      );
    } catch (err) {
      console.error("Transaction error:", err);
      setStatus("❌ Transaction failed. Please check your wallet and balance.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleBuy} style={formStyle}>
      <p style={{ color: "#0fef21", fontWeight: "bold", textAlign: "center", marginBottom: 4 }}>
        Min: 0.05 SOL &nbsp;&nbsp; Max: 5 SOL
      </p>

      <input
        type="number"
        placeholder="SOL amount"
        value={solAmount}
        min="0.005"
        max="5"
        step="0.0001"
        inputMode="decimal"
        disabled={loading}
        onChange={(e) => updateFromSol(e.target.value)}
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="WoofAi Token amount"
        value={wfaiAmount}
        min="5000"
        max="5000000"
        step="1"
        inputMode="numeric"
        disabled={loading}
        onChange={(e) => updateFromWfai(e.target.value)}
        style={inputStyle}
      />

      <button
        type="submit"
        disabled={loading}
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
