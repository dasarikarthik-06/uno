# UNO Game: UI Changes 

Create a modern UNO game UI that visually matches the attached reference image.

The UI should look colorful, polished, animated, and mobile-game styled exactly like a professional UNO app.

## Overall Layout

Build the screen as a full-screen responsive game table.

### Background

* Use a bright cartoon-style background.
* Main colors:

  * cyan blue
  * lime green
  * yellow-green
* Add soft gradients and glowing effects.
* The center should contain a large 3D-style “UNO” logo/table area.
* Add subtle floating geometric shapes in the background for depth.

---

# Player Layout

There are 4 opponents + 1 current player.

## Opponent Positions

### Top Center

* Opponent avatar with username underneath.
* Cards displayed horizontally in a curved fan layout.
* Cards face-down (UNO card backs visible).

### Left Middle

* Opponent avatar on left side.
* Cards stacked vertically in fan style.

### Right Middle

* Opponent avatar on right side.
* Cards stacked vertically in fan style.

### Bottom (Current Player)

* Current player cards visible face-up.
* Cards displayed in horizontal fan layout.
* Cards should slightly overlap.
* Cards should lift upward on hover/touch.
* Current player hand centered at bottom.

---

# Center Area

In the center:

## Discard Pile

* Show currently played UNO card.
* Card should be large and slightly rotated.
* Add glow/shadow around active card.

## Draw Pile

* Place draw deck on upper-left side of center.
* Stack of UNO cards face-down.

## Turn Direction Indicator

* Add circular rotating arrows around center.
* Use cyan/blue glowing arrows.
* Animate rotation slowly.

---

# UNO Card Design

UNO cards must:

* Have rounded corners.
* Use authentic UNO-inspired colors:

  * red
  * blue
  * green
  * yellow
* Include:

  * only numbers(0-9)

Card style:

* glossy
* soft shadows
* high saturation
* thick white borders
* arcade/mobile-game appearance

---

# Avatars

Each player should have:

* rounded square avatar
* colorful border glow
* username below avatar
* modern cartoon appearance

---

# Animations

Add smooth animations:

* card hover lift
* card dealing animation
* glowing effects
* rotating direction arrows
* smooth transitions
* subtle floating background motion

Use CSS animations and transforms.

---

# Style Requirements

Use:

* React + Tailwind CSS & Material-UI(whatever is best for the design)

Design style:

* modern mobile game UI
* polished
* cartoonish
* visually rich
* highly animated
* responsive for desktop and mobile

Avoid:

* plain flat design
* minimal UI
* generic card layouts

The final UI should visually resemble a real UNO mobile game lobby/table screen.

---

# Technical Requirements

Component structure:

* GameTable
* PlayerSeat
* CardHand
* UnoCard
* DrawPile
* DiscardPile
* TurnIndicator

Use reusable components.

Use proper z-index layering and absolute positioning to match the UNO table layout.

---

# Important

The UI must visually match the provided reference image:

* same player positioning
* same colorful game atmosphere
* same centered UNO table composition
* same mobile-game polish
* same card arrangement style