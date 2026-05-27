import React from 'react';

/**
 * UnoCard - Individual card with authentic UNO styling
 */
export default function UnoCard({ 
  color = 'RED', 
  number = '5', 
  faceDown = false, 
  onClick = () => {},
  className = '',
  style = {}
}) {
  const colorMap = {
    'RED': '#EF4444',
    'BLUE': '#3B82F6',
    'GREEN': '#10B981',
    'YELLOW': '#FBBF24',
    'red': '#EF4444',
    'blue': '#3B82F6',
    'green': '#10B981',
    'yellow': '#FBBF24',
  };

  const bgColor = colorMap[color] || '#EF4444';

  if (faceDown) {
    return (
      <div
        onClick={onClick}
        className={`w-14 h-20 rounded-lg cursor-pointer active:scale-95 ${className}`}
        style={{
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
          border: '2px solid white',
          transition: 'all 0.1s ease',
          ...style
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-white text-xl font-bold">U</div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`w-14 h-20 rounded-lg cursor-pointer active:scale-95 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
        boxShadow: `0 8px 16px rgba(0,0,0,0.3), 0 0 12px ${bgColor}66`,
        border: '2px solid white',
        transition: 'all 0.1s ease',
        ...style
      }}
    >
      <div className="w-full h-full flex items-center justify-center text-white font-bold">
        <div className="text-2xl">{number}</div>
      </div>
    </div>
  );
}
