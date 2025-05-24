import React, { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import PresaleForm from "./components/PresaleForm";
import Countdown from "./components/Countdown";

const audiowideLink = document.createElement("link");
audiowideLink.href = "https://fonts.googleapis.com/css2?family=Audiowide&display=swap";
audiowideLink.rel = "stylesheet";
document.head.appendChild(audiowideLink);

export default function App() {
  const [showWalletPopup, setShowWalletPopup] = useState(false);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isPhantom = window?.solana?.isPhantom;
    const isSolflare = window?.solflare?.isSolflare;

    if (isMobile && !isPhantom && !isSolflare) {
      setShowWalletPopup(true);
    }
  }, []);

  const handleRedirect = (wallet) => {
    const url = encodeURIComponent(window.location.href);
    if (wallet === "phantom") {
      window.location.href = `https://phantom.app/ul/browse/${url}`;
    } else if (wallet === "solflare") {
      window.location.href = `https://solflare.com/link/browser?url=${url}`;
    }
  };

  return (
    <>
      <AnimatedBackground />
      {showWalletPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupBox}>
            <h3>Open in Wallet Browser</h3>
            <p>To connect your wallet, please open this site in:</p>
            <button onClick={() => handleRedirect("phantom")} style={styles.popupButton}>
              Open in Phantom
            </button>
            <button onClick={() => handleRedirect("solflare")} style={styles.popupButton}>
              Open in Solflare
            </button>
          </div>
        </div>
      )}

      <div style={styles.page}>
        <div style={styles.parallaxLayer1}></div>
        <div style={styles.parallaxLayer2}></div>
        <div style={styles.container}>
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
              © 2025 WoofAi · Contact: <a href="mailto:woofai.coin@gmail.com" style={styles.contactLink}>woofai.coin@gmail.com</a>
            </footer>
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
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popupBox: {
    backgroundColor: "#001f00",
    padding: 24,
    borderRadius: 12,
    border: "1px solid #0efa5a99",
    color: "#0efa5a",
    textAlign: "center",
    width: 300,
    boxShadow: "0 0 20px #0efa5a55",
  },
  popupButton: {
    backgroundColor: "#0efa5a",
    color: "#001f00",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 8,
    width: "100%",
    fontWeight: "600",
    fontSize: 16,
    cursor: "pointer",
  },
  parallaxLayer1: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "url('https://www.transparenttextures.com/patterns/stardust.png') repeat",
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
    background: "radial-gradient(circle at center, #0fef21 15%, transparent 80%)",
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
    background: "linear-gradient(270deg, #0fef21, #002200, #004400, #0fef21)",
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
    color: "#0efa5a",
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
    boxShadow: "0 0 10px #0efa5a44",
    border: "1px solid #0efa5a99",
    color: "#0efa5a",
    textAlign: "center",
    flex: "1 1 320px",
  },
  heading: {
    fontSize: 32,
    marginBottom: 14,
    fontWeight: "700",
    textShadow: "0 0 6px #0efa5a88",
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