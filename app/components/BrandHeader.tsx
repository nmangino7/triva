'use client';

export default function BrandHeader({ subtitle }: { subtitle?: string }) {
  return (
    <div className="text-center mb-6">
      <h1 className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg tracking-tight">
        Trivia<span className="text-yellow-300">Buzz</span>
      </h1>
      {subtitle && <p className="text-white/80 font-semibold mt-1">{subtitle}</p>}
    </div>
  );
}
