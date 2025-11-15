export default function Home() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">ゲーム</h1>

      <div className="space-y-4">
        <a
          href="/speaker/testroom"
          className="block p-4 bg-blue-200 rounded-lg"
        >
          説明者ページ（例: testroom）
        </a>

        <a
          href="/mc/testroom"
          className="block p-4 bg-green-200 rounded-lg"
        >
          MCページ（例: testroom）
        </a>

        <a
          href="/public/testroom"
          className="block p-4 bg-yellow-200 rounded-lg"
        >
          公開ページ（例: testroom）
        </a>
      </div>

      <p className="mt-8 text-gray-600">
        ※ とりあえずテスト表示のトップページです
      </p>
    </div>
  );
}
