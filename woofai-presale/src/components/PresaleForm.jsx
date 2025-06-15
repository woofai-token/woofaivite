import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const BACKEND_URL = "https://woofaiserver.onrender.com";
const WFAI_PER_USDT = 1 / 0.0000052; 
const RECEIVER_WALLET = new PublicKey("GWkwfF8BbA591V4ZFTLDJJ9eRy5Mhp2Z9zNBNFvf6cgy");

async function updateTotalSold(wfaiAmount) {
  const totalRef = doc(db, "sales", "total");

  try {
    const snap = await getDoc(totalRef);
    const previous = snap.exists() ? Number(snap.data().wfaiAmount || 0) : 0;
    const newTotal = previous + parseInt(wfaiAmount, 10);

    await setDoc(totalRef, { wfaiAmount: newTotal }, { merge: true });
    console.log("✅ WFAI total updated:", newTotal);
  } catch (e) {
    console.error("❌ Failed to update total sold:", e);
  }
}


export default function PresaleForm() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const [usdtAmount, setUsdtAmount] = useState("");
  const [solAmount, setSolAmount] = useState("");
  const [wfaiAmount, setWfaiAmount] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [solPrice, setSolPrice] = useState(null);

  useEffect(() => {
    async function fetchSolPrice() {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
        const data = await res.json();
        setSolPrice(data.solana.usd);
      } catch (err) {
        setStatus("❌ Failed to fetch SOL price.");
      }
    }
    fetchSolPrice();
  }, []);

  const updateFromUsdt = (value) => {
    setUsdtAmount(value);
    const usdt = parseFloat(value);
    if (!isNaN(usdt) && solPrice) {
      const sol = usdt / solPrice;
      setSolAmount(sol.toFixed(4));
      setWfaiAmount((usdt * WFAI_PER_USDT).toFixed(0));
    } else {
      setSolAmount("");
      setWfaiAmount("");
    }
  };

  async function handleBuy(e) {
    e.preventDefault();

    if (!connected || !publicKey) {
      setStatus("❌ Please connect your wallet first.");
      return;
    }

    const sol = parseFloat(solAmount);
    if (!sol || isNaN(sol) || sol <= 0) {
      setStatus("❌ Enter a valid amount in USDT.");
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
    wfaiAmount: (parseInt(wfaiAmount, 10) * 1e9).toString(), // now correct
  }),
});

      const data = await response.json();
      setStatus(
        response.ok && data.success
          ? "🎉 Purchase successful! Tokens sent."
          : `❌ Backend error: ${data.error || "Unknown error"}`
      );
      updateTotalSold(wfaiAmount)
    } catch (err) {
      console.error("Transaction error:", err);
      setStatus("❌ Transaction failed. Please check your wallet and balance.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleBuy} style={formStyle}>
      <p style={{ color: "#0fef21", fontWeight: "bold", textAlign: "center", marginBottom: -10 }}>
        Min: ~$1 USDT &nbsp;&nbsp; Max: ~$500 USDT
      </p>
   <p style={{ color: "#0fef21", fontWeight: "bold", textAlign: "center", marginBottom: 4 }}>
        Current price: 1 $WOFAI = $0.0000052 USDT &nbsp;&nbsp; Next Presale price: 1 $WOFAI = $0.0000054 USDT
      </p>

      <input
        type="number"
        placeholder="USDT amount"
        value={usdtAmount}
        min="1"
        max="500"
        step="0.01"
        inputMode="decimal"
        disabled={loading}
        onChange={(e) => updateFromUsdt(e.target.value)}
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="SOL you will pay"
        value={solAmount}
        disabled
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="WoofAi Token amount"
        value={wfaiAmount}
        disabled
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