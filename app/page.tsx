import Link from 'next/link';

export default function Home() {
  return (
    <main className="animated-bg min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-6">
      <h1 className="animate-pop-in text-6xl sm:text-7xl font-black text-white drop-shadow-lg tracking-tight mb-2">
        Trivia<span className="text-yellow-300">Buzz</span>
      </h1>
      <p className="animate-fade-in-up text-white/80 font-semibold text-lg mb-12 text-center">
        The office buzzer game. Pick a category, share the code, buzz to win.
      </p>

      <div className="grid sm:grid-cols-2 gap-5 w-full max-w-2xl">
        <Link
          href="/host"
          style={{ animationDelay: '120ms' }}
          className="animate-fade-in-up group bg-white rounded-3xl p-8 text-center shadow-2xl hover:scale-[1.04] hover:-rotate-1 active:scale-95 transition"
        >
          <div className="text-5xl mb-3 group-hover:animate-float">🎙️</div>
          <h2 className="text-2xl font-black text-gray-900">Host a Game</h2>
          <p className="text-gray-500 mt-1">Run it on the big screen</p>
        </Link>

        <Link
          href="/play"
          style={{ animationDelay: '200ms' }}
          className="animate-fade-in-up group bg-yellow-300 rounded-3xl p-8 text-center shadow-2xl hover:scale-[1.04] hover:rotate-1 active:scale-95 transition"
        >
          <div className="text-5xl mb-3 group-hover:animate-float">📱</div>
          <h2 className="text-2xl font-black text-gray-900">Join a Game</h2>
          <p className="text-gray-700 mt-1">Enter a room code</p>
        </Link>
      </div>
    </main>
  );
}
