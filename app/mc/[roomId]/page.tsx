"use client";

import { use, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";

export default function MCPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);

  const [candidates, setCandidates] = useState<string[]>([]);
  const [publicHints, setPublicHints] = useState<string[]>([]);
  const [round, setRound] = useState<number>(1);

  // ============================
  // Firestore リアルタイム取得
  // ============================
  useEffect(() => {
    const ref = doc(db, "rooms", roomId, "public", "data");

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setCandidates(data.hintCandidates || []);
        setPublicHints(data.hints || []);
        setRound(data.round || 1);
      }
    });

    return () => unsub();
  }, [roomId]);

  // ============================
  // グルーピング
  // ============================
  const groupHints = () => {
    const normalize = (str: string) => str.toLowerCase();
    const groups: Record<string, string[]> = {};

    candidates.forEach((hint) => {
      const nHint = normalize(hint);
      let matchedKey: string | null = null;

      for (const key in groups) {
        const nKey = normalize(key);

        let found = false;
        for (let len = 2; len <= Math.min(nHint.length, nKey.length); len++) {
          for (let i = 0; i + len <= nHint.length; i++) {
            const sub = nHint.substring(i, i + len);
            if (nKey.includes(sub)) {
              found = true;
              break;
            }
          }
          if (found) break;
        }

        if (found) {
          matchedKey = key;
          break;
        }
      }

      if (matchedKey) {
        groups[matchedKey].push(hint);
      } else {
        groups[hint] = [hint];
      }
    });

    return Object.entries(groups).sort((a, b) => a[1].length - b[1].length);
  };

  const grouped = groupHints();

  // ============================
  // 公開ヒントに追加
  // ============================
  const publishHint = async (hint: string) => {
    const ref = doc(db, "rooms", roomId, "public", "data");
    await updateDoc(ref, {
      hints: arrayUnion(hint),
    });
  };

  // ============================
  // 次のラウンドへ（+1）
  // ============================
  const nextRound = async () => {
    const ref = doc(db, "rooms", roomId, "public", "data");

    await updateDoc(ref, {
      hints: [],
      hintCandidates: [],
      answer: "",
      round: round + 1,
    });
  };

  // ============================
  // ラウンドリセット（完全初期化）
  // ============================
  const resetAll = async () => {
    const ref = doc(db, "rooms", roomId, "public", "data");

    await updateDoc(ref, {
      hints: [],
      hintCandidates: [],
      answer: "",
      round: 1,
    });
  };

  // ============================
  // 色
  // ============================
  const getColor = (size: number) => {
    if (size === 1) return "border-green-500";
    if (size === 2) return "border-yellow-500";
    return "border-red-500";
  };

  return (
    <div className="p-6 space-y-10">

      {/* ============================== */}
      {/* ラウンド表示＆ボタン */}
      {/* ============================== */}
      <div className="p-4 bg-yellow-100 rounded-xl flex items-center justify-between">
        <div className="text-xl font-bold">現在のラウンド：{round}</div>

        <div className="flex gap-3">
          <button
            onClick={nextRound}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            次のラウンドへ
          </button>

          <button
            onClick={resetAll}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            ラウンドリセット
          </button>
        </div>
      </div>

      {/* ============================================================= */}
      {/*   説明者から届いた候補ヒント（グループ化 & ソート済）    */}
      {/* ============================================================= */}
      <div>
        <h2 className="text-xl font-bold mb-4">候補ヒント（グループ化）</h2>

        <div className="space-y-6">
          {grouped.map(([key, list]) => (
            <div
              key={key}
              className={`border-2 rounded-xl p-4 ${getColor(list.length)}`}
            >
              <div className="font-bold mb-3">
                グループ（人数: {list.length}）
              </div>

              <div className="flex flex-wrap gap-2">
                {list.map((hint, idx) => (
                  <button
                    key={idx}
                    onClick={() => publishHint(hint)}
                    className="px-3 py-1 bg-gray-100 hover:bg-blue-200 rounded-md"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================= */}
      {/*                     公開中のヒント一覧                        */}
      {/* ============================================================= */}
      <div>
        <h2 className="text-xl font-bold mb-4">公開中のヒント</h2>

        <div className="space-y-2">
          {publicHints.map((hint, idx) => (
            <div key={idx} className="p-2 bg-blue-100 rounded-md">
              {hint}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
