"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function ExplanationSender() {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [roomId, setRoomId] = useState("");

  // Firestore へ送信
  const handleSend = async () => {
    if (!roomId) {
      alert("Room ID を入力してください");
      return;
    }
    if (!text.trim()) {
      alert("説明文を入力してください");
      return;
    }

    try {
      await addDoc(collection(db, "rooms", roomId, "hints"), {
        text: text,
        author: author || "unknown",
        isDuplicate: false,
        createdAt: serverTimestamp(),
      });

      alert("送信しました！");
      setText("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("送信に失敗しました");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>説明送信（説明者用画面）</h2>

      <div style={{ marginBottom: 10 }}>
        <label>Room ID：</label>
        <input
          type="text"
          placeholder="例：2FCxVLQr0N4Csu16W7cT"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>あなたの名前：</label>
        <input
          type="text"
          placeholder="ニックネーム"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>説明文：</label>
        <textarea
          placeholder="ここに説明を書いてください"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", height: 120, padding: 8 }}
        />
      </div>

      <button
        onClick={handleSend}
        style={{
          padding: "10px 20px",
          background: "black",
          color: "white",
          borderRadius: 8,
          border: "none",
        }}
      >
        送信
      </button>
    </div>
  );
}
