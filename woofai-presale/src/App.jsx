import React, { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import PresaleForm from "./components/PresaleForm";
import Countdown from "./components/Countdown";

// Load Audiowide font dynamically
const audiowideLink = document.createElement("link");
audiowideLink.href = "https://fonts.googleapis.com/css2?family=Audiowide&display=swap";
audiowideLink.rel = "stylesheet";
document.head.appendChild(audiowideLink);

// Inject keyframe animations globally
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes parallax1 {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-100px); }
  }

  @keyframes parallax2 {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-50px); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default function App() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [walletName, setWalletName] = useState("");

  useEffect(() => {
    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInAppBrowser = /phantom|solflare/i.test(navigator.userAgent);
    const hasPhantom = window?.phantom?.solana?.isPhantom;
    const hasSolflare = window?.solflare?.isSolflare;

    if (isMobile && !isInAppBrowser && (hasPhantom || hasSolflare)) {
      setShowPrompt(true);
      setWalletName(hasPhantom ? "Phantom" : "Solflare");
    }
  }, []);

  const openInWalletApp = () => {
    const currentUrl = window.location.href;
    const deeplink = walletName === "Phantom"
      ? `https://phantom.app/ul/browse/${encodeURIComponent(currentUrl)}`
      : `https://solflare.com/ul/browse/${encodeURIComponent(currentUrl)}`;
    window.location.href = deeplink;
  };

  return (
    <>
      <AnimatedBackground />
      {showPrompt && (
        <div style={styles.promptBanner}>
          <p>
            {walletName} Wallet detected. For best experience,{" "}
            <strong>open this site inside the {walletName} app browser.</strong>
          </p>
          <button onClick={openInWalletApp} style={styles.openBtn}>
            Open in {walletName}
          </button>
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
              © 2025 WoofAi · Contact:{" "}
              <a href="mailto:woofai.coin@gmail.com" style={styles.contactLink}>
                woofai.coin@gmail.com
              </a>
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
    // animation: "spin 15s linear infinite",
    userSelect: "none",
  },
  logoContainer: {
    marginBottom: 14,
    perspective: 900,
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
  promptBanner: {
    backgroundColor: "#001f00",
    color: "#0efa5a",
    padding: "14px 20px",
    textAlign: "center",
    fontSize: "15px",
    fontFamily: "'Audiowide', monospace",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 9999,
    boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
  },
  openBtn: {
    marginTop: 10,
    backgroundColor: "#0efa5a",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    fontWeight: "bold",
    color: "#001f00",
    cursor: "pointer",
    boxShadow: "0 0 10px #0efa5a66",
  },
};
