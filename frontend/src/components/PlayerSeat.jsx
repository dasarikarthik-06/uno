import React from 'react';
import UnoCard from './UnoCard.jsx';

/**
 * PlayerSeat - Individual player position with avatar and cards
 */
export default function PlayerSeat({ 
  position = 'top', // top, left, right, bottom
  username = 'Player',
  cards = [],
  isCurrentPlayer = false,
  isActive = false,
  onCardClick = () => {}
}) {
  const positionStyles = {
    top: {
      top: '5%',
      left: '50%',
      transform: 'translateX(-50%)',
      flexDirection: 'column',
      alignItems: 'center',
    },
    bottom: {
      bottom: '5%',
      left: '50%',
      transform: 'translateX(-50%)',
      flexDirection: 'column',
      alignItems: 'center',
    },
    left: {
      left: '3%',
      top: '50%',
      transform: 'translateY(-50%)',
      flexDirection: 'column',
      alignItems: 'center',
    },
    right: {
      right: '3%',
      top: '50%',
      transform: 'translateY(-50%)',
      flexDirection: 'column',
      alignItems: 'center',
    },
  };

  const cardContainerStyles = {
    top: { flexDirection: 'row', justifyContent: 'center', gap: '2px', width: '240px', height: '80px' },
    bottom: { flexDirection: 'row', justifyContent: 'center', gap: '-6px', width: '320px', height: '110px' },
    left: { flexDirection: 'column', justifyContent: 'center', gap: '2px', width: '80px', height: '240px' },
    right: { flexDirection: 'column', justifyContent: 'center', gap: '2px', width: '80px', height: '240px' },
  };

  const avatarSize = position === 'bottom' ? 'w-12 h-12' : 'w-10 h-10';
  const avatarColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'];
  const colorIndex = username.charCodeAt(0) % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  return (
    <div 
      className="absolute flex flex-col items-center"
      style={positionStyles[position]}
    >
      {/* Avatar */}
      <div
        className={`rounded-lg ${avatarSize} mb-1 flex items-center justify-center text-white font-bold text-sm`}
        style={{
          background: `linear-gradient(135deg, ${avatarColor} 0%, ${avatarColor}dd 100%)`,
          boxShadow: isActive 
            ? `0 0 16px ${avatarColor}, 0 6px 12px rgba(0,0,0,0.2)` 
            : '0 3px 6px rgba(0,0,0,0.2)',
          border: isActive ? `2px solid #06B6D4` : '2px solid white',
          transition: 'all 0.2s ease',
        }}
      >
        {username.charAt(0).toUpperCase()}
      </div>

      {/* Username */}
      <div className="text-white font-bold text-xs mb-1 whitespace-nowrap">{username}</div>

      {/* Cards Container */}
      <div 
        className="relative flex"
        style={{
          ...cardContainerStyles[position],
          perspective: '1000px',
        }}
      >
        {cards.length > 0 ? (
          cards.map((card, index) => {
            let cardStyle = {};
            
            if (position === 'bottom') {
              const totalCards = cards.length;
              const angle = (index - (totalCards - 1) / 2) * 12;
              const yOffset = Math.abs(index - (totalCards - 1) / 2) * 6;
              
              cardStyle = {
                transform: `rotateZ(${angle}deg) translateY(${yOffset}px)`,
                marginLeft: index === 0 ? '0px' : '-10px',
              };
            } else if (position === 'top') {
              cardStyle = {
                transform: `rotateZ(${(index - (cards.length - 1) / 2) * 6}deg)`,
                marginLeft: index === 0 ? '0px' : '-8px',
              };
            } else if (['left', 'right'].includes(position)) {
              cardStyle = {
                transform: `rotateZ(${(index - (cards.length - 1) / 2) * 4}deg)`,
                marginTop: index === 0 ? '0px' : '-6px',
              };
            }

            return (
              <div 
                key={index}
                onClick={() => isCurrentPlayer && onCardClick(index)}
                style={cardStyle}
                className={isCurrentPlayer ? 'cursor-pointer' : ''}
              >
                <UnoCard 
                  faceDown={!isCurrentPlayer}
                  color={card.color}
                  number={card.value}
                />
              </div>
            );
          })
        ) : null}
      </div>

      {/* Card count badge for opponents */}
      {!isCurrentPlayer && cards.length > 0 && (
        <div 
          className="mt-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
        >
          {cards.length}
        </div>
      )}
    </div>
  );
}
