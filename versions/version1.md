# UNO: Multiplayer game - Version 1

Build a simple MVP version of a real-time multiplayer UNO-inspired card game.

The goal is to build a clean and working full-stack multiplayer game first
before adding advanced rules.

Keep the implementation simple, modular, and easy to extend.

# Tech Stack

## Frontend

- React JS
- Tailwind CSS
- Material UI
- React Router
- Context API or Zustand
- Socket.IO client

## Backend

- Node.js
- Express.js
- Socket.IO
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt for password hashing

---

# MVP Scope

This version should ONLY support:

- Number cards (0-9)
- 4 colors:

  - RED
  - BLUE
  - GREEN
  - YELLOW
- Basic turn system
- Draw card
- Play card
- Win condition

Do NOT implement:

- Skip cards
- Reverse cards
- Draw +2
- Wild cards
- UNO button
- Chat system
- Matchmaking
- Spectator mode

Keep everything minimal and functional.

---

# Authentication

## Signup

Users can:

- create account using username and password

Requirements:

- username must be unique
- password hashed using bcrypt
- JWT generated after login/signup

## Login

Users can:

- login using username and password

Requirements:

- protected routes using JWT
- proper validation and error handling

---

# Home Page

After login, user lands on home page.

## Features

### Host Game

- User creates a room
- Backend generates unique room ID
- User becomes host
- Redirect to lobby

### Join Game

- User enters room ID
- Backend validates room
- If valid:

  - join room
  - redirect to lobby
- If invalid:

  - show error

---

# Lobby Page

## Features

Players can see:

- room ID
- room name
- joined players
- host player

## Host Controls

Host can:

- start game
- leave room

## Non-host Controls

Player can:

- leave room

## Start Conditions

- Start button visible only for host
- Start button enabled only when player count >= 2

When host starts:

- all players move to game page using WebSockets

---

# Card Structure

Each card has:

```js
{
  value: number,
  color: "RED" | "BLUE" | "GREEN" | "YELLOW"
}
```

Example:

```js
{
  value: 7,
  color: "RED"
}
```

---

# Deck Rules

Create deck using:

- numbers 0-9
- all 4 colors

Shuffle deck randomly before game starts.

---

# Game Initialization

When game starts:

Backend should:

- create shuffled deck
- distribute 7 cards to each player
- place one card in center discard pile
- assign first turn to room host
- initialize game state
- broadcast state to all players

---

# Game Page

This is the main screen.

## Layout

### Top Area

Display:

- room ID
- current turn player

### Center Area

Display:

- previous played card
- draw deck

### Bottom Area

Display:

- current player's hand cards

### Opponent Area

Display:

- player names
- remaining card count

---

# Card UI

Cards should have very simple UI.

## Card Rendering Rules

Frontend should render:

- card number
- card color

Card background color should match card color.

Example:

- RED card → red background
- BLUE card → blue background

## Example Card Component

```jsx
<Card
  value={7}
  color="RED"
  isPlayable={true}
/>;
```

## UI Rules

### Playable Card

- clickable
- slight border highlight
- hover effect

### Non-playable Card

- faded slightly
- disabled click

Use simple styling only:

- rounded corners
- centered number
- basic hover animation

Do NOT make overly complex card designs.

Example style logic:

```js
const colorMap = {
  RED: "bg-red-500",
  BLUE: "bg-blue-500",
  GREEN: "bg-green-500",
  YELLOW: "bg-yellow-400 text-black",
};
```

---

# Turn Rules

Player can:

- play a valid card OR
- draw one card

## Valid Card Conditions

A card can be played if:

- card color matches previous card color OR
- card number matches previous card number

Example:

```txt
Previous Card: RED 5

Valid:
- RED 1
- BLUE 5

Invalid:
- GREEN 8
```

---

# Turn Flow

After:

- playing a valid card OR
- drawing a card

Turn automatically moves to next player.

Current player should receive:

- toast notification saying:

```txt
Your Turn
```

---

# Important Backend Rule

ALL game validation must happen on backend.

Backend handles:

- valid moves
- turn validation
- winner detection
- game rules

Frontend should NEVER trust itself for game rules.

---

# Win Condition

When player's hand becomes empty:

```js
player.hand.length === 0;
```

That player wins.

---

# End Game Screen

Display:

- winner
- all players ranking
- remaining card count

Options:

- Play Again
- Back To Home

---

# Real-Time Communication

Use Socket.IO for:

- room join/leave
- lobby updates
- game start
- turn updates
- card play
- draw actions
- game end

All players must stay synchronized in real time.

---

# Backend Architecture

Use clean modular structure.

## Backend Structure

```txt
backend/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── socket/
│   ├── models/
│   ├── middleware/
│   ├── game/
│   │   ├── engine/
│   │   ├── state/
│   │   └── utils/
│   ├── database/
│   └── config/
```

## Frontend Structure

```txt
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   ├── socket/
│   ├── api/
│   ├── styles/
│   ├── hooks/
│   └── utils/
```

---

# Backend State Management

Use state-management pattern for backend game state.

Game engine should manage:

- players
- deck
- discard pile
- current turn
- winner

Keep game logic isolated from:

- routes
- controllers
- socket handlers

Socket handlers should only:

- receive events
- call services
- emit updates

---

# Socket Events

Implement structured socket events.

Example:

```txt
ROOM_CREATE
ROOM_JOIN
ROOM_LEAVE
GAME_START
TURN_CHANGED
CARD_PLAYED
CARD_DRAWN
GAME_STATE_UPDATE
GAME_OVER
```

---

# Database Schemas

## User

```js
{
  username: String,
  password: String
}
```

## Room

```js
{
  roomId: String,
  hostId: String,
  players: [],
  status: "LOBBY" | "PLAYING" | "FINISHED"
}
```

---

# Engineering Requirements

- Use reusable React components
- Use service layer pattern
- Avoid large socket files
- Use constants/enums
- Keep code modular
- Follow clean architecture
- Keep UI minimal and functional
- Prioritize multiplayer synchronization correctness over UI complexity
