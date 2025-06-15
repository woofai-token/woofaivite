import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const TARGET = 100000000;

export default function SaleProgress() {
  const [sold, setSold] = useState(19200000);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const totalRef = doc(db, "sales", "total");
          const snap = await getDoc(totalRef);
          const amount = snap.exists() ? Number(snap.data().wfaiAmount || 0) : 0;
          setSold(amount);
        } catch (err) {
          console.error("❌ Error fetching sale progress:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const progressPercent = Math.min((sold / TARGET) * 100, 100).toFixed(2);

  return (
    <div style={{ marginTop: 20, textAlign: "center" }}>
      <h3 style={{ color: "#0fef21" }}>
        🔥 Sold: {(sold).toLocaleString()} WFAI / {(TARGET).toLocaleString()} WFAI
      </h3>
      <div style={{ background: "#222", borderRadius: 8, overflow: "hidden", height: 20, marginTop: 8 }}>
        <div
          style={{
            width: `${progressPercent}%`,
            backgroundColor: "#0fef21",
            height: "100%",
            transition: "width 0.5s ease",
          }}
        ></div>
      </div>
      <p style={{ color: "#0fef21", marginTop: 6 }}>{progressPercent}% Complete</p>
    </div>
  );
}
