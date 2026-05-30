'use client';

export default function HostLeftScreen() {
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="text-6xl">👋</div>
      <h2 className="text-3xl font-black text-white">The host ended the game</h2>
      <p className="text-white/80">Thanks for playing! Ask the host to start a new room to play again.</p>
      <a
        href="/"
        className="inline-block px-8 py-3 rounded-2xl bg-white text-gray-900 font-bold hover:bg-white/90 transition"
      >
        Back to Home
      </a>
    </div>
  );
}
