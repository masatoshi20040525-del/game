"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function PublicViewPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  // 🔥 Next.js 16 では params は Promise → use() で unwrap 必須
  const { roomId } = use(params);

  const [hints, setHints] = useState<string[]>([]);

  useEffect(() => {
    const ref = doc(db, "rooms", roomId, "public", "data");
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as any;
        setHints(data.hints || []);
      }
    });

    return () => unsub();
  }, [roomId]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">公開ヒント一覧</h1>

      <div className="w-full max-w-2xl space-y-4">
        {hints.map((h, i) => (
          <div
            key={i}
            className="p-5 text-xl bg-white rounded-xl shadow font-semibold text-gray-900 text-center"
          >
            {h}
          </div>
        ))}
      </div>
    </div>
  );
}
