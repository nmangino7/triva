'use client';

const PALETTE = [
  { bg: 'bg-rose-500', ring: 'ring-rose-300', shape: '▲' },
  { bg: 'bg-sky-500', ring: 'ring-sky-300', shape: '◆' },
  { bg: 'bg-amber-500', ring: 'ring-amber-300', shape: '●' },
  { bg: 'bg-emerald-500', ring: 'ring-emerald-300', shape: '■' },
];

interface Props {
  index: number;
  text: string;
  status?: 'idle' | 'correct' | 'wrong' | 'dim';
}

export default function ColorOptionBlock({ index, text, status = 'idle' }: Props) {
  const p = PALETTE[index % 4];
  const isCorrect = status === 'correct';
  const isWrong = status === 'wrong';
  const isDim = status === 'dim';

  return (
    <div
      style={{ animationDelay: `${index * 70}ms` }}
      className={`animate-fade-in-up relative flex items-center gap-3 rounded-2xl p-4 sm:p-5 text-white font-bold shadow-lg transition-all duration-300 ${
        isCorrect
          ? 'bg-emerald-500 ring-4 ring-emerald-200 scale-[1.03]'
          : isWrong
          ? 'bg-gray-400 opacity-60'
          : isDim
          ? `${p.bg} opacity-30 scale-95`
          : `${p.bg} hover:brightness-110`
      }`}
    >
      <span className="text-2xl sm:text-3xl drop-shadow">{p.shape}</span>
      <span className="text-lg sm:text-xl leading-tight">{text}</span>
      {isCorrect && <span className="absolute right-4 text-2xl">✓</span>}
    </div>
  );
}
