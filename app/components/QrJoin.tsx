'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// Renders a scannable QR code that deep-links to /play?code=CODE.
export default function QrJoin({ code }: { code: string }) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/play?code=${code}`;
    QRCode.toDataURL(url, {
      width: 220,
      margin: 1,
      color: { dark: '#1e1b4b', light: '#ffffff' },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(''));
  }, [code]);

  if (!dataUrl) return null;

  return (
    <div className="inline-flex flex-col items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt={`Scan to join room ${code}`} className="rounded-2xl shadow-lg w-44 h-44 sm:w-52 sm:h-52" />
      <span className="text-white/70 text-sm font-semibold">Scan to join</span>
    </div>
  );
}
