import React from 'react';

/**
 * TurnIndicator - Rotating direction arrows around center
 */
export default function TurnIndicator({ isClockwise = true }) {
  return (
    <div 
      className="absolute flex items-center justify-center pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        width: '240px',
        height: '240px',
        transform: 'translate(-50%, -50%)',
        zIndex: 15,
      }}
    >
      {/* Rotating arrows */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{
          animation: isClockwise ? 'rotateArrows 3s linear infinite' : 'rotateArrows 3s linear infinite reverse',
          willChange: 'transform',
        }}
      >
        {/* Arrow 1 - Top */}
        <g>
          <line x1="100" y1="20" x2="100" y2="35" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round"/>
          <polygon points="100,20 96,28 104,28" fill="#06B6D4"/>
        </g>
        
        {/* Arrow 2 - Right */}
        <g>
          <line x1="180" y1="100" x2="165" y2="100" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round"/>
          <polygon points="180,100 172,96 172,104" fill="#06B6D4"/>
        </g>
        
        {/* Arrow 3 - Bottom */}
        <g>
          <line x1="100" y1="180" x2="100" y2="165" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round"/>
          <polygon points="100,180 104,172 96,172" fill="#06B6D4"/>
        </g>
        
        {/* Arrow 4 - Left */}
        <g>
          <line x1="20" y1="100" x2="35" y2="100" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round"/>
          <polygon points="20,100 28,104 28,96" fill="#06B6D4"/>
        </g>
      </svg>

      <style>{`
        @keyframes rotateArrows {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
