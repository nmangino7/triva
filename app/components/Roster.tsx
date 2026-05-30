'use client';

interface Props {
  names: { id: string; name: string }[];
  myId?: string;
}

export default function Roster({ names, myId }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-white/70 mb-2 text-center">
        PLAYERS ({names.length})
      </p>
      {names.length === 0 ? (
        <p className="text-center text-white/60 text-sm">Waiting for players to join…</p>
      ) : (
        <div className="flex flex-wrap gap-2 justify-center">
          {names.map((n) => (
            <span
              key={n.id}
              className={`px-4 py-2 rounded-full font-semibold ${
                n.id === myId ? 'bg-yellow-300 text-black' : 'bg-white/20 text-white'
              }`}
            >
              {n.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
