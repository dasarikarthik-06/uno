const colorMap = {
  RED: 'bg-red-600 text-white',
  BLUE: 'bg-blue-600 text-white',
  GREEN: 'bg-emerald-600 text-white',
  YELLOW: 'bg-yellow-400 text-black',
};

export default function Card({ card, onClick, clickable }) {
  if (!card) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      className={`min-w-[68px] min-h-[100px] rounded-2xl px-3 py-4 shadow-lg ${colorMap[card.color]} ${clickable ? 'cursor-pointer hover:scale-105' : 'opacity-80'} transition-transform`}
    >
      <div className="text-xs uppercase tracking-[.2em]">{card.color}</div>
      <div className="mt-2 text-3xl font-bold">{card.value}</div>
    </button>
  );
}
