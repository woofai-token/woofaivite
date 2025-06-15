import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCh2aDvTue-BBe2UosP6oBY8HQNG0GTDkU",
  authDomain: "crypto-d5749.firebaseapp.com",
  projectId: "crypto-d5749",
  storageBucket: "crypto-d5749.firebasestorage.app",
  messagingSenderId: "698009027599",
  appId: "1:698009027599:web:3d749e0254453e61570f7a",
  measurementId: "G-HDMGY6KZYE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// 👇 Authentication
const auth = getAuth(app);
signInAnonymously(auth).catch((error) => {
  console.error("❌ Anonymous sign-in failed:", error);
});

export { db, analytics, auth };
