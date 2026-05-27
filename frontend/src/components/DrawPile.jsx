import React from 'react';

/**
 * DrawPile - Stack of face-down cards
 */
export default function DrawPile({ cardCount = 50, onClick = () => {} }) {
  return (
    <div 
      className="absolute cursor-pointer active:scale-95"
      style={{
        left: '22%',
        top: '32%',
        width: '72px',
        height: '108px',
        transition: 'all 0.1s ease',
      }}
      onClick={onClick}
    >
      {/* Card stack effect */}
      {[2, 1, 0].map((offset) => (
        <div
          key={offset}
          className="absolute rounded-lg"
          style={{
            width: '56px',
            height: '84px',
            background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
            border: '2px solid white',
            transform: `translateY(${offset * 3}px) translateX(${offset * 2}px)`,
            zIndex: 10 - offset,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-lg font-bold">U</div>
          </div>
        </div>
      ))}
      
      {/* Card count label */}
      <div 
        className="absolute text-white font-bold text-xs text-center"
        style={{
          bottom: '-28px',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
        }}
      >
        {cardCount}
      </div>
    </div>
  );
}
