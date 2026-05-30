'use client';

import { useState } from 'react';

export default function RoomCodeBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked; code is visible anyway */
    }
  };

  return (
    <button
      onClick={copy}
      className="group inline-flex flex-col items-center"
      title="Click to copy"
    >
      <span className="text-sm font-semibold text-white/70 mb-1">ROOM CODE {copied ? '· copied!' : ''}</span>
      <span className="text-5xl sm:text-6xl font-black tracking-[0.3em] text-white bg-white/10 rounded-2xl px-6 py-3 group-hover:bg-white/20 transition">
        {code}
      </span>
    </button>
  );
}
