import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import PresaleForm from "./components/PresaleForm";

export default function App() {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "40px auto",
        padding: 20,
        borderRadius: 12,
        backgroundColor: "#121212",
        color: "#0fef21",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0 0 10px #0fef21",
        textAlign: "center",
      }}
    >
      <h1>🐶 WoofAi Token Presale</h1>
      <WalletMultiButton />
      <PresaleForm />
      <footer style={{ marginTop: 40, fontSize: 12, opacity: 0.6 }}>
        © 2025 WoofAi Presale. Contact: woofai.coin@gmail.com
      </footer>
    </div>
  );
}
