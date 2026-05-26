const colorMap = {
  RED: 'bg-red-600 text-white',
  BLUE: 'bg-blue-600 text-white',
  GREEN: 'bg-emerald-600 text-white',
  YELLOW: 'bg-yellow-400 text-black',
};

export default function Card({ card, onClick, clickable, className = '' }) {
  if (!card) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      className={`min-w-[72px] min-h-[108px] rounded-[24px] border-2 border-white/90 px-3 py-4 shadow-xl ${colorMap[card.color]} ${className} ${clickable ? 'cursor-pointer hover:-translate-y-1 hover:shadow-2xl' : 'opacity-95'} transition-all duration-200`}
    >
      <div className="text-[10px] uppercase tracking-[.4em] opacity-90">{card.color}</div>
      <div className="mt-3 text-4xl font-black">{card.value}</div>
    </button>
  );
}
