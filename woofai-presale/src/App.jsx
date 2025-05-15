import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import PresaleForm from "./components/PresaleForm";
import TokenomicsChart from "./components/TokenomicsChart";
import Countdown from "./components/Countdown";

// Audiowide font still loaded dynamically
const audiowideLink = document.createElement("link");
audiowideLink.href = "https://fonts.googleapis.com/css2?family=Audiowide&display=swap";
audiowideLink.rel = "stylesheet";
document.head.appendChild(audiowideLink);

export default function App() {
  return (
    <>
      <AnimatedBackground />
      <div style={styles.page}>
        <div style={styles.parallaxLayer1}></div>
        <div style={styles.parallaxLayer2}></div>

        <div style={styles.container}>
          {/* Left: Presale */}
          <div style={styles.presaleSection}>
            <div style={styles.logoContainer}>
              <img
                src="https://crimson-certain-wolf-336.mypinata.cloud/ipfs/bafybeih3iwshjpvlxlsbg6mazrv77qu3inzpmixvznyaihqa2ut674nklu"
                alt="WoofAi Logo"
                style={styles.spinningLogo}
              />
            </div>
            <h1 style={styles.heading}>🚀 WoofAi Token Presale</h1>
            <Countdown />
            <WalletMultiButton style={styles.walletButton} />
            <PresaleForm />
            <p style={styles.burnNote}>
              🔥 Unsold tokens will be <strong>burned forever</strong>.
            </p>
            <footer style={styles.footer}>
              © 2025 WoofAi · Contact:{" "}
              <a href="mailto:woofai.coin@gmail.com" style={styles.contactLink}>
                woofai.coin@gmail.com
              </a>
            </footer>
          </div>

          {/* Right: Tokenomics */}
          <div style={styles.chartSection}>
            <h2 style={styles.chartHeading}>📊 Tokenomics</h2>
            <TokenomicsChart />
          </div>
        </div>
      </div>
    </>
  );
}

function AnimatedBackground() {
  return <div style={styles.animatedBackground}></div>;
}

const styles = {
  parallaxLayer1: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background:
      "url('https://www.transparenttextures.com/patterns/stardust.png') repeat",
    opacity: 0.1,
    zIndex: 0,
    pointerEvents: "none",
    animation: "parallax1 60s linear infinite",
  },
  parallaxLayer2: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background:
      "radial-gradient(circle at center, #0fef21 15%, transparent 80%)",
    opacity: 0.04,
    zIndex: 0,
    pointerEvents: "none",
    animation: "parallax2 40s linear infinite",
  },
  animatedBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background:
      "linear-gradient(270deg, #0fef21, #002200, #004400, #0fef21)",
    backgroundSize: "800% 800%",
    animation: "gradientMove 30s ease infinite",
    filter: "blur(70px)",
    zIndex: -2,
  },
  page: {
    position: "relative",
    padding: 24,
    minHeight: "100vh",
    fontFamily: "'Audiowide', monospace",
    color: "#0efa5a", // softer green
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflowX: "hidden",
  },
  container: {
    zIndex: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 36,
    flexWrap: "wrap",
    maxWidth: 1100,
    width: "100%",
  },
  presaleSection: {
    maxWidth: 480,
    padding: 28,
    borderRadius: 12,
    backgroundColor: "rgba(0, 40, 0, 0.85)",
    boxShadow: "0 0 10px #0efa5a44", // subtle glow
    border: "1px solid #0efa5a99",
    color: "#0efa5a",
    textAlign: "center",
    flex: "1 1 320px",
  },
  chartSection: {
    padding: 28,
    backgroundColor: "rgba(0, 40, 0, 0.85)",
    borderRadius: 12,
    border: "1px solid #0efa5a99",
    boxShadow: "0 0 10px #0efa5a44",
    flex: "1 1 320px",
    textAlign: "center",
    minWidth: 280,
    maxWidth: 480,
  },
  heading: {
    fontSize: 32,
    marginBottom: 14,
    fontWeight: "700",
    textShadow: "0 0 6px #0efa5a88",
  },
  chartHeading: {
    fontSize: 24,
    marginBottom: 18,
    fontWeight: "600",
    textShadow: "0 0 5px #0efa5a77",
  },
  walletButton: {
    marginBottom: 22,
    backgroundColor: "#0efa5a",
    color: "#001f00",
    fontWeight: "600",
    borderRadius: 8,
    boxShadow: "0 0 12px #0efa5a66",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  burnNote: {
    marginTop: 28,
    fontSize: 15,
    fontWeight: "600",
    color: "#f44336",
    textShadow: "none",
  },
  footer: {
    marginTop: 48,
    fontSize: 13,
    opacity: 0.85,
    color: "#0efa5aaa",
  },
  contactLink: {
    color: "#0efa5a",
    textDecoration: "underline",
  },
  spinningLogo: {
    width: 120,
    height: 120,
    borderRadius: 16,
    boxShadow: "0 0 18px #0efa5a88",
    animation: "spin 15s linear infinite",
    userSelect: "none",
  },
  logoContainer: {
    marginBottom: 14,
    perspective: 900,
  },
};
