'use client';

const PALETTE = [
  { bg: 'bg-rose-500', shape: '▲' },
  { bg: 'bg-sky-500', shape: '◆' },
  { bg: 'bg-amber-500', shape: '●' },
  { bg: 'bg-emerald-500', shape: '■' },
];

interface Props {
  index: number;
  text: string;
  status?: 'idle' | 'correct' | 'wrong' | 'dim' | 'selected';
  onClick?: () => void;
  disabled?: boolean;
  tally?: number; // optional count badge (host tap reveal)
}

export default function ColorOptionBlock({ index, text, status = 'idle', onClick, disabled, tally }: Props) {
  const p = PALETTE[index % 4];
  const isCorrect = status === 'correct';
  const isWrong = status === 'wrong';
  const isDim = status === 'dim';
  const isSelected = status === 'selected';

  const base =
    'animate-fade-in-up relative flex items-center gap-3 rounded-2xl p-4 sm:p-5 text-white font-bold shadow-lg transition-all duration-300 w-full text-left';
  const look = isCorrect
    ? 'bg-emerald-500 ring-4 ring-emerald-200 scale-[1.03]'
    : isWrong
    ? 'bg-gray-400 opacity-60'
    : isDim
    ? `${p.bg} opacity-30 scale-95`
    : isSelected
    ? `${p.bg} ring-4 ring-white scale-[1.03]`
    : `${p.bg} ${onClick ? 'hover:brightness-110 active:scale-95 cursor-pointer' : ''}`;

  const content = (
    <>
      <span className="text-2xl sm:text-3xl drop-shadow">{p.shape}</span>
      <span className="text-lg sm:text-xl leading-tight flex-1">{text}</span>
      {isCorrect && <span className="text-2xl">✓</span>}
      {isSelected && <span className="text-sm font-semibold">your pick</span>}
      {typeof tally === 'number' && (
        <span className="ml-auto bg-black/25 rounded-full px-3 py-1 text-sm">{tally}</span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        style={{ animationDelay: `${index * 70}ms` }}
        className={`${base} ${look} disabled:cursor-default`}
      >
        {content}
      </button>
    );
  }

  return (
    <div style={{ animationDelay: `${index * 70}ms` }} className={`${base} ${look}`}>
      {content}
    </div>
  );
}
