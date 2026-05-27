const COLORS = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
const VALUES = Array.from({ length: 10 }, (_, i) => i);

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createDeck() {
  const deck = [];
  COLORS.forEach((color) => {
    // 0 card: 1 copy
    deck.push({ color, value: 0 });
    // 1-9 cards: 2 copies each
    for (let value = 1; value <= 9; value++) {
      deck.push({ color, value });
      deck.push({ color, value });
    }
  });
  return shuffle(deck);
}

function dealHands(players) {
  const deck = createDeck();
  const hands = players.map(() => deck.splice(0, 7));
  return { deck, hands };
}

function canPlay(card, activeCard) {
  return card.color === activeCard.color || card.value === activeCard.value;
}

function nextTurn(room) {
  room.currentTurn = (room.currentTurn + 1) % room.players.length;
}

function createGameState(room) {
  const state = {
    ...room,
    started: true,
    winner: null,
    currentTurn: 0,
    discard: [],
  };
  const { deck, hands } = dealHands(room.players);
  state.deck = deck;
  state.players = room.players.map((player, index) => ({ ...player, hand: hands[index] }));
  const firstCard = state.deck.shift();
  state.discard = [firstCard];
  return state;
}

function playCardInRoom(room, userId, cardIndex) {
  if (room.players[room.currentTurn].userId !== userId) {
    return { error: 'Not your turn' };
  }
  const player = room.players.find((p) => p.userId === userId);
  if (!player) return { error: 'Player not found' };
  const card = player.hand[cardIndex];
  if (!card) return { error: 'Card not found' };
  const activeCard = room.discard[room.discard.length - 1];
  if (!canPlay(card, activeCard)) {
    return { error: 'Card does not match' };
  }
  player.hand.splice(cardIndex, 1);
  room.discard.push(card);
  if (player.hand.length === 0) {
    room.winner = userId;
    return { success: true };
  }
  nextTurn(room);
  return { success: true };
}

function drawCardInRoom(room, userId) {
  if (room.players[room.currentTurn].userId !== userId) {
    return { error: 'Not your turn' };
  }
  const player = room.players.find((p) => p.userId === userId);
  if (!player) return { error: 'Player not found' };
  
  // If deck is empty, generate a fresh deck (unlimited deck)
  if (room.deck.length === 0) {
    room.deck = createDeck();
  }
  
  const card = room.deck.shift();
  if (!card) return { error: 'No cards left' };
  player.hand.push(card);
  const activeCard = room.discard[room.discard.length - 1];
  if (!canPlay(card, activeCard)) {
    nextTurn(room);
  }
  return { success: true, drawnCard: card, playable: canPlay(card, activeCard) };
}

module.exports = {
  createGameState,
  playCardInRoom,
  drawCardInRoom,
  canPlay,
};
