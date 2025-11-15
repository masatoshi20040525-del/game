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
    <div style={{ padding: 20 }}>
      <h1>ヒントを送信（カタカナor半角英数字）</h1>

      <input
        value={hint}
        onChange={(e) => setHint(e.target.value)}
        placeholder="ヒントを書いて送信"
        style={{ width: "300px" }}
      />

      <button onClick={sendHint}>送信</button>
    </div>
  );
}
