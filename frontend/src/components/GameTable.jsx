import React, { useMemo } from "react";
import PlayerSeat from "./PlayerSeat.jsx";
import DrawPile from "./DrawPile.jsx";
import DiscardPile from "./DiscardPile.jsx";
import TurnIndicator from "./TurnIndicator.jsx";

/**
 * GameTable - Main game board with all players and center elements
 */
export default function GameTable({
  gameState = null,
  currentUserId = null,
  onPlayCard = () => {},
  onDrawCard = () => {},
  onExit = () => {},
}) {
  if (!gameState || !gameState.players || gameState.players.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        Loading game...
      </div>
    );
  }

  // Find current player index
  const currentPlayerIndex = gameState.players.findIndex(
    (p) => p.userId === currentUserId,
  );
  const currentTurnPlayerName =
    gameState.players[gameState.currentTurn]?.username || "Player";
  const isMyTurn = gameState.currentTurn === currentPlayerIndex;

  // Arrange players: current player at bottom (0), then arrange others relative to that
  const arrangedPlayers = useMemo(() => {
    const players = gameState.players;
    if (currentPlayerIndex === -1) return [];

    const arranged = [];
    const positions = ["bottom", "top", "left", "right"];

    for (let i = 0; i < players.length; i++) {
      const offset = (i - currentPlayerIndex + players.length) % players.length;
      arranged.push({
        ...players[i],
        position: positions[offset],
        isCurrentPlayer: i === currentPlayerIndex,
      });
    }

    return arranged;
  }, [gameState.players, currentPlayerIndex]);

  const discardCard = gameState.discard?.[gameState.discard.length - 1] || {
    color: "RED",
    value: 5,
  };
  const drawPileCount = gameState.deck?.length || 50;
  const isClockwise = gameState.direction !== "reverse";

  return (
    <div
      className="relative w-full h-full flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 25%, #10B981 50%, #FBBF24 75%, #0EA5E9 100%)",
        overflow: "hidden",
        height: "100vh",
      }}
    >
      {/* Top Info Bar */}
      <div className="flex justify-between items-center px-6 py-3 z-50">
        <button
          onClick={onExit}
          className="text-white font-bold bg-red-600 bg-opacity-80 px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all"
        >
          ✕ Exit
        </button>

        <div className="text-white font-bold text-center">
          <div
            className={`text-lg ${isMyTurn ? "text-lime-300" : "text-white"}`}
          >
            {isMyTurn ? "🎮 Your Turn" : `${currentTurnPlayerName}'s Turn`}
          </div>
          <div className="text-sm opacity-80">Deck: {drawPileCount} cards</div>
        </div>

        <div className="text-white font-bold text-center">
          <div className="text-sm opacity-75">Room</div>
          <div className="text-lg">{gameState?.players?.length ?? 0}P</div>
        </div>
      </div>

      {/* Game Table */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-10"
              style={{
                width: `${200 + i * 100}px`,
                height: `${200 + i * 100}px`,
                background: "rgba(255,255,255,0.3)",
                left: `${20 + i * 30}%`,
                top: `${10 + i * 25}%`,
                animation: `float ${4 + i * 2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* Table container fills available screen area without overflow */}
        <div
          className="relative"
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100vw",
            maxHeight: "100%",
            padding: "1rem",
            boxSizing: "border-box",
          }}
        >
          {/* Table background */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #84CC16 0%, #65A30D 100%)",
              boxShadow:
                "0 30px 60px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)",
              zIndex: 1,
            }}
          />

          {/* Game elements */}
          <div className="absolute inset-0" style={{ zIndex: 10 }}>
            <DiscardPile card={discardCard} />
            <DrawPile cardCount={drawPileCount} onClick={onDrawCard} />
            <TurnIndicator isClockwise={isClockwise} />

            {/* Players */}
            {arrangedPlayers.map((player) => (
              <PlayerSeat
                key={player.userId}
                position={player.position}
                username={player.username}
                cards={player.hand || []}
                isCurrentPlayer={player.isCurrentPlayer}
                isActive={
                  gameState.currentTurn ===
                  gameState.players.findIndex((p) => p.userId === player.userId)
                }
                onCardClick={(cardIndex) => {
                  if (player.isCurrentPlayer) {
                    onPlayCard(cardIndex);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>
    </div>
  );
}
