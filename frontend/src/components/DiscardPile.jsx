import React from 'react';
import UnoCard from './UnoCard.jsx';

/**
 * DiscardPile - Currently played card in center
 */
export default function DiscardPile({ card = { color: 'RED', value: 5 } }) {
  return (
    <div 
      className="absolute flex items-center justify-center"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120px',
        height: '160px',
        zIndex: 20,
      }}
    >
      <div
        style={{
          position: 'absolute',
          transform: 'rotate(-15deg)',
          filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.4))',
        }}
      >
        <UnoCard 
          color={card.color} 
          number={card.value}
          className="shadow-lg"
        />
      </div>
    </div>
  );
}
