'use client';

interface Props {
  disabled: boolean;
  onBuzz: () => void;
  label?: string;
}

export default function Buzzer({ disabled, onBuzz, label }: Props) {
  return (
    <button
      onClick={onBuzz}
      disabled={disabled}
      className={`relative w-full aspect-square max-w-[20rem] mx-auto rounded-full font-black text-4xl sm:text-5xl tracking-wider shadow-2xl transition-all select-none ${
        disabled
          ? 'bg-gray-300 text-gray-400 cursor-not-allowed scale-95'
          : 'bg-gradient-to-b from-red-500 to-red-700 text-white hover:from-red-400 hover:to-red-600 active:scale-90 animate-pulse-slow'
      }`}
    >
      <span className="absolute inset-3 rounded-full border-4 border-white/30" />
      {label ?? 'BUZZ'}
    </button>
  );
}
