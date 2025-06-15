import React, { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import PresaleForm from "./components/PresaleForm";
import TokenomicsChart from "./components/TokenomicsChart";
import Countdown from "./components/Countdown";
import SaleProgress from "./components/progress"; 

// Audiowide font still loaded dynamically
const audiowideLink = document.createElement("link");
audiowideLink.href = "https://fonts.googleapis.com/css2?family=Audiowide&display=swap";
audiowideLink.rel = "stylesheet";
document.head.appendChild(audiowideLink);

// Wallet app store URLs
const PHANTOM_APPSTORE_URL = "https://apps.apple.com/app/phantom-solana-wallet/id1598432977";
const PHANTOM_PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=com.phantom.app";

const SOLFLARE_APPSTORE_URL = "https://apps.apple.com/app/solflare-solana-wallet/id1438432821";
const SOLFLARE_PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=com.solflare.wallet";

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isWalletBrowser() {
  // Phantom browser user agent includes "Phantom"
  // Solflare browser user agent includes "Solflare"
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("phantom") || ua.includes("solflare");
}

export default function App() {
  const [showWalletPopup, setShowWalletPopup] = useState(false);

  useEffect(() => {
    if (isMobile() && !isWalletBrowser()) {
      setShowWalletPopup(true);
    }
  }, []);

  // Copy current URL to clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  // Open correct app store link depending on platform
  const openAppStoreLink = (wallet) => {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (wallet === "phantom") {
      window.open(isIOS ? PHANTOM_APPSTORE_URL : PHANTOM_PLAYSTORE_URL, "_blank");
    } else if (wallet === "solflare") {
      window.open(isIOS ? SOLFLARE_APPSTORE_URL : SOLFLARE_PLAYSTORE_URL, "_blank");
    }
  };

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
            <h1 style={styles.heading}>🚀 WoofAi Token Presale 1</h1>
            <Countdown />
            <SaleProgress />
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

      {showWalletPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h2 style={{ marginBottom: 12 }}>Please open this site inside Phantom or Solflare wallet browser</h2>
            <p style={{ marginBottom: 20 }}>
              To ensure full wallet functionality, please open this website in either the Phantom or Solflare mobile wallet browser.
            </p>
            <div style={styles.buttonRow}>
              <button
                onClick={() => openAppStoreLink("phantom")}
                style={{ ...styles.walletButton, marginRight: 12 }}
              >
                Download Phantom
              </button>
              <button
                onClick={() => openAppStoreLink("solflare")}
                style={styles.walletButton}
              >
                Download Solflare
              </button>
            </div>
            <div style={{ marginTop: 24 }}>
              <label style={{ fontWeight: "600" }}>Or copy this link and open in wallet browser:</label>
              <div style={styles.copyLinkContainer}>
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  style={styles.copyLinkInput}
                />
                <button onClick={copyLinkToClipboard} style={styles.copyButton}>
                  Copy Link
                </button>
              </div>
            </div>
            {/* <button
              onClick={() => setShowWalletPopup(false)}
              style={{ ...styles.walletButton, marginTop: 24, backgroundColor: "#f44336" }}
            >
              Close
            </button> */}
          </div>
        </div>
      )}
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
  heading: {
    fontSize: 32,
    marginBottom: 14,
    fontWeight: "700",
    textShadow: "0 0 6px #0efa5a88",
  },
  walletButton: {
    padding: "10px 18px",
    backgroundColor: "#0efa5a",
    color: "#001f00",
    fontWeight: "600",
    borderRadius: 8,
    boxShadow: "0 0 12px #0efa5a66",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    border: "none",
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
    animation: "spin 22s linear infinite",
    objectFit: "contain",
  },
  logoContainer: {
    marginBottom: 22,
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "90vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: 20,
  },
  popup: {
    backgroundColor: "#001f00",
    borderRadius: 14,
    maxWidth: 380,
    padding: 24,
    boxShadow: "0 0 30px #0efa5aaa",
    textAlign: "center",
    color: "#0efa5a",
    fontFamily: "'Audiowide', monospace",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: 16,
  },
  copyLinkContainer: {
    marginTop: 8,
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  copyLinkInput: {
    flex: 1,
    padding: 6,
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #0efa5a77",
    backgroundColor: "#002200",
    color: "#0efa5a",
    fontFamily: "'Audiowide', monospace",
    userSelect: "all",
  },
  copyButton: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#0efa5a",
    color: "#001f00",
    cursor: "pointer",
    fontWeight: "600",
  },
};