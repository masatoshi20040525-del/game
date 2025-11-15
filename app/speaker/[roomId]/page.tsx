"use client";

import { use } from "react";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function SpeakerPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);

  const [hint, setHint] = useState("");

  const sendHint = async () => {
    if (!hint.trim()) return;

    const ref = doc(db, "rooms", roomId, "public", "data");

    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};

    const updated = [...(data.hintCandidates || []), hint];

    await setDoc(ref, { hintCandidates: updated }, { merge: true });

    setHint("");
  };

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 500,
        margin: "0 auto",
        fontSize: "20px",
        lineHeight: "1.8",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: 20 }}>
        ヒントを送信（カタカナ or 半角英数字）
      </h1>

      <input
        value={hint}
        onChange={(e) => setHint(e.target.value)}
        placeholder="ヒントを書いて送信"
        style={{
          width: "100%",
          padding: "14px 16px",
          fontSize: "20px",
          borderRadius: "10px",
          border: "2px solid #4a90e2",  // ← ★ 枠の色変更
          marginBottom: "20px",
          outline: "none",

          // フォーカス時の青枠を再現（inlineで擬似クラス使えないため工夫）
          boxShadow: hint
            ? "0 0 6px rgba(74,144,226,0.5)"
            : "none",
        }}
      />

      <button
        onClick={sendHint}
        style={{
          width: "100%",
          padding: "14px 16px",
          fontSize: "22px",
          fontWeight: "bold",
          background: "#4a90e2",     // ← ★ 塗りつぶし色
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",

          // ホバー表現（inlineで擬似クラス不可 → 反転しない安全な補助）
          transition: "background 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#2d6ac7")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#4a90e2")}
      >
        送信
      </button>
    </div>
  );
}
