# PetSitter - Board Game

A two-player board game built with React + Vite where a Pet and a Sitter compete on a grid-based board.

## Tech Stack
- React 18
- Vite 5
- Vanilla CSS
- localStorage for state persistence

## Game Overview

Two players take turns: one plays as a **Pet** (cat, dog, hamster, etc.) and the other as a **Sitter** (human character). Players roll dice and move around a 15x10 grid board.

## Features

### Character Setup Screen
- Two-panel character creation (Pet vs Sitter)
- **Name input** with random name generator (`[?]` button)
  - Generates names like "HungryPumpkin", "SleepyNoodle" from adjective + noun lists
- **Avatar selection** - cycle through options with `< >` arrows
  - Pets: Cat, Dog, Hamster, Bird, Fish, Bunny, Turtle, Frog, Mouse, Owl, Pig, Duck, Bear, Snake, Fox, Penguin
  - Sitters: 5 different human ASCII art faces with various hairstyles
- **Color selection** - separate palettes per player
  - Pet (Primary): Red, Blue, Yellow, Green, Orange
  - Sitter (Secondary): Purple, Teal, Pink, Indigo, Brown
- Name text displays in selected color
- Start button activates when both names are entered

### Game Board
- 15x10 grid of 80px cells
- Simple black background with 1px white borders
- ASCII avatars display in cells when revealed

### Dice System
- Two ASCII dice with asterisk pips (1-6)
- Click to roll with animation:
  - Starts fast (~10 changes/sec), slows down over ~4 seconds
  - Click sound on each change using Web Audio API
  - Shake animation while rolling

### Turn System
- Players displayed in left gutter with:
  - Name and ASCII avatar in their color
  - "YOUR TURN" banner on active player
  - Inactive player is dimmed
- Dice shown below players in left gutter

### Movement System
- After rolling, player must move exactly (dice1 + dice2) spaces
- **Hold SHIFT** to:
  - Reveal your current location on the board
  - See valid move cells (highlighted with colored border)
  - Click to move to adjacent cells
- Movement is orthogonal only (up/down/left/right, no diagonals)
- Cannot cross over cells already visited this turn
- Path lights up in player's color as they move
- "Moves left: X" counter displayed during movement
- Turn switches after all moves are used

### State Persistence
- Game state saved to localStorage automatically
- Survives page refresh (helpful during development)
- Saves: game state, players, positions, dice, turn, movement state

### End Game
- Button at bottom of game screen
- Returns to setup screen with characters preserved
- Can update characters or start new game

## File Structure

```
petsitter/
├── src/
│   ├── App.jsx      # Main game component with all logic
│   ├── App.css      # All styles
│   ├── index.css    # Base styles
│   └── main.jsx     # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## Running the Game

```bash
npm install
npm run dev
```

Opens at http://localhost:5173/

## TODO / Future Ideas
- Define what happens when players land on same square
- Add special squares (move forward/back)
- Add win condition
- Add game objectives for Pet and Sitter
- Sound effects for movement
- Mobile touch support
