import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'

// Board dimensions
const BOARD_WIDTH = 15
const BOARD_HEIGHT = 10

// Pet-specific treats
const PET_TREATS = {
  Cat: { name: 'Fish', icon: '><>' },
  Dog: { name: 'Bones', icon: 'o==o' },
  Hamster: { name: 'Seeds', icon: '@' },
  Bird: { name: 'Worms', icon: '~s' },
  Fish: { name: 'Pellets', icon: 'o' },
  Bunny: { name: 'Carrots', icon: '/\\' },
  Turtle: { name: 'Lettuce', icon: '{~}' },
  Frog: { name: 'Flies', icon: '*:' },
  Mouse: { name: 'Cheese', icon: '▲' },
  Owl: { name: 'Mice', icon: '~o' },
  Pig: { name: 'Apples', icon: '(@)' },
  Duck: { name: 'Bread', icon: '[]' },
  Bear: { name: 'Honey', icon: '{o}' },
  Fox: { name: 'Berries', icon: '::' },
  Penguin: { name: 'Fish', icon: '><>' },
}

// Random name generator words
const ADJECTIVES = [
  'Happy', 'Sleepy', 'Hungry', 'Fuzzy', 'Silly', 'Brave', 'Tiny', 'Giant',
  'Sneaky', 'Bouncy', 'Grumpy', 'Jolly', 'Lucky', 'Mighty', 'Swift', 'Clever',
  'Fluffy', 'Sparkly', 'Cosmic', 'Wild', 'Gentle', 'Fierce', 'Lazy', 'Hyper',
  'Dizzy', 'Fancy', 'Goofy', 'Snappy', 'Wiggly', 'Zippy', 'Crispy', 'Muddy'
]

const NOUNS = [
  'Pumpkin', 'Banana', 'Noodle', 'Pickle', 'Muffin', 'Waffle', 'Nugget', 'Biscuit',
  'Taco', 'Pretzel', 'Cookie', 'Cupcake', 'Pancake', 'Donut', 'Sprout', 'Peanut',
  'Bubbles', 'Whiskers', 'Buttons', 'Snickers', 'Wombat', 'Penguin', 'Tornado', 'Rocket',
  'Cheese', 'Potato', 'Mango', 'Coconut', 'Thunder', 'Sparkle', 'Noodles', 'Dumpling'
]

function generateRandomName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return adj + noun
}

// Primary colors for Pet (Player 1)
const PRIMARY_COLORS = [
  { name: 'Red', value: '#e74c3c' },
  { name: 'Blue', value: '#3498db' },
  { name: 'Yellow', value: '#f1c40f' },
  { name: 'Green', value: '#2ecc71' },
  { name: 'Orange', value: '#e67e22' },
]

// Secondary colors for Sitter (Player 2)
const SECONDARY_COLORS = [
  { name: 'Purple', value: '#9b59b6' },
  { name: 'Teal', value: '#1abc9c' },
  { name: 'Pink', value: '#e91e63' },
  { name: 'Indigo', value: '#3f51b5' },
  { name: 'Silver', value: '#bdc3c7' },
]

// Pet avatar options
const PET_AVATARS = [
  {
    name: 'Cat',
    art: ` /\\_/\\
( o.o )
 > ^ <`
  },
  {
    name: 'Dog',
    art: ` /^ ^\\
( o o )
 ( Y )`
  },
  {
    name: 'Hamster',
    art: ` (\\_/)
( •_•)
 / > <`
  },
  {
    name: 'Bird',
    art: `  ___
>(o o)<
  ( )
  -"-`
  },
  {
    name: 'Fish',
    art: `
><(((°>
`
  },
  {
    name: 'Bunny',
    art: ` (\\(\\
 ( -.-)
o_(")(")`
  },
  {
    name: 'Turtle',
    art: `  _____
 /     \\
|^^ ^^|_)
 \\_____/`
  },
  {
    name: 'Frog',
    art: `  @..@
 (----)
( >__< )
 ^^^^^^`
  },
  {
    name: 'Mouse',
    art: `  ()_()
 (o.o )
 (| |)
  " "`
  },
  {
    name: 'Owl',
    art: `  ,_,
 (O,O)
 (   )
 -"-"-`
  },
  {
    name: 'Pig',
    art: `  ^  ^
 (o  o)
 ( oo )
  (  )`
  },
  {
    name: 'Duck',
    art: `   __
 >(o )___
  ( ._> /
   \`---'`
  },
  {
    name: 'Bear',
    art: ` ʕ·͡ᴥ·ʔ
 (    )
 (    )
  "  "`
  },
  {
    name: 'Fox',
    art: ` /\\   /\\
(  o.o  )
 >  ^  <
  /| |\\`
  },
  {
    name: 'Penguin',
    art: `   __
  (o o)
 /|  |\\
  |__|`
  },
]

// Sitter avatar options (human faces)
const SITTER_AVATARS = [
  {
    name: 'Person 1',
    art: `  ,,,
 (o.o)
  \\-/
  /|\\
  / \\`
  },
  {
    name: 'Person 2',
    art: ` \\|||/
 (o.o)
  )-(
  /|\\
  / \\`
  },
  {
    name: 'Person 3',
    art: `  ___
 /o.o\\
 \\_-_/
  /|\\
  / \\`
  },
  {
    name: 'Person 4',
    art: ` ~~~~~
 (o.o)
  )-(
  /|\\
  / \\`
  },
  {
    name: 'Person 5',
    art: `  |||
 [o.o]
  ]-[
  /|\\
  / \\`
  },
]

// ASCII dice faces using asterisks
const diceFaces = {
  1: [
    '     ',
    '  *  ',
    '     ',
  ],
  2: [
    '*    ',
    '     ',
    '    *',
  ],
  3: [
    '*    ',
    '  *  ',
    '    *',
  ],
  4: [
    '*   *',
    '     ',
    '*   *',
  ],
  5: [
    '*   *',
    '  *  ',
    '*   *',
  ],
  6: [
    '*   *',
    '*   *',
    '*   *',
  ],
}

// Create a click sound using Web Audio API
function playClick() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = 800
  oscillator.type = 'square'

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.05)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.05)
}

function CharacterSetup({ player, config, onConfigChange }) {
  const { name, colorIndex, avatarIndex } = config
  const isPet = player === 1
  const avatars = isPet ? PET_AVATARS : SITTER_AVATARS
  const colors = isPet ? PRIMARY_COLORS : SECONDARY_COLORS

  const cycleColor = (direction) => {
    const newIndex = (colorIndex + direction + colors.length) % colors.length
    onConfigChange({ ...config, colorIndex: newIndex })
  }

  const cycleAvatar = (direction) => {
    const newIndex = (avatarIndex + direction + avatars.length) % avatars.length
    onConfigChange({ ...config, avatarIndex: newIndex })
  }

  const currentAvatar = avatars[avatarIndex]

  return (
    <div className="character-setup" style={{ borderColor: colors[colorIndex].value }}>
      <h2 className="player-title">
        Player {player}
        <span className="player-role">{isPet ? '[ Pet ]' : '[ Sitter ]'}</span>
      </h2>

      <div className="setup-field">
        <label>Avatar:</label>
        <div className="avatar-picker">
          <button className="picker-arrow" onClick={() => cycleAvatar(-1)}>&lt;</button>
          <div className="avatar-label">{currentAvatar.name}</div>
          <button className="picker-arrow" onClick={() => cycleAvatar(1)}>&gt;</button>
        </div>
      </div>

      <div className="character-preview" style={{ color: colors[colorIndex].value }}>
        <pre className="ascii-art">{currentAvatar.art}</pre>
      </div>

      <div className="setup-field">
        <label>Color:</label>
        <div className="color-picker">
          <button className="picker-arrow" onClick={() => cycleColor(-1)}>&lt;</button>
          <div
            className="color-swatch"
            style={{ backgroundColor: colors[colorIndex].value }}
          >
            {colors[colorIndex].name}
          </div>
          <button className="picker-arrow" onClick={() => cycleColor(1)}>&gt;</button>
        </div>
      </div>

      <div className="setup-field">
        <label>Name:</label>
        <div className="name-input-row">
          <input
            type="text"
            value={name}
            onChange={(e) => onConfigChange({ ...config, name: e.target.value })}
            placeholder={isPet ? 'Enter pet name...' : 'Enter sitter name...'}
            className="name-input"
            style={{ color: colors[colorIndex].value }}
          />
          <button
            className="random-name-btn"
            onClick={() => onConfigChange({ ...config, name: generateRandomName() })}
            title="Random name"
          >
            [?]
          </button>
        </div>
      </div>
    </div>
  )
}

function SetupScreen({ onStartGame, player1, player2, setPlayer1, setPlayer2 }) {
  const canStart = player1.name.trim() && player2.name.trim()

  return (
    <div className="setup-screen">
      <h1 className="title">~*~ PetSitter ~*~</h1>
      <p className="setup-subtitle">Create your characters</p>

      <div className="setup-container">
        <CharacterSetup
          player={1}
          config={player1}
          onConfigChange={setPlayer1}
        />
        <div className="setup-divider">VS</div>
        <CharacterSetup
          player={2}
          config={player2}
          onConfigChange={setPlayer2}
        />
      </div>

      <button
        className="start-button"
        onClick={onStartGame}
        disabled={!canStart}
      >
        {canStart ? '[ Start Game ]' : '[ Enter names to start ]'}
      </button>
    </div>
  )
}

function Dice({ value, rolling, active }) {
  const face = diceFaces[value]

  return (
    <div className={`dice ${rolling ? 'rolling' : ''} ${active ? 'active' : ''}`}>
      <pre className="dice-face">
        {face.join('\n')}
      </pre>
    </div>
  )
}

// Load saved game state from localStorage
function loadGameState() {
  try {
    const saved = localStorage.getItem('petsitter-game')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load game state:', e)
  }
  return null
}

function App() {
  const savedState = loadGameState()

  const [gameState, setGameState] = useState(savedState?.gameState || 'setup')
  const [player1, setPlayer1] = useState(savedState?.player1 || { name: '', colorIndex: 0, avatarIndex: 0 })
  const [player2, setPlayer2] = useState(savedState?.player2 || { name: '', colorIndex: 1, avatarIndex: 0 })
  const [currentTurn, setCurrentTurn] = useState(savedState?.currentTurn || 1)

  // Player positions on the grid
  const [player1Pos, setPlayer1Pos] = useState(savedState?.player1Pos || { row: 0, col: 0 })
  const [player2Pos, setPlayer2Pos] = useState(savedState?.player2Pos || { row: 0, col: 0 })
  const [revealLocation, setRevealLocation] = useState(false)

  const [dice1, setDice1] = useState(savedState?.dice1 || 1)
  const [dice2, setDice2] = useState(savedState?.dice2 || 1)
  const [rolling, setRolling] = useState(false)
  const rollTimeoutRef = useRef([])

  // Movement state
  const [isMoving, setIsMoving] = useState(savedState?.isMoving || false)
  const [movesRemaining, setMovesRemaining] = useState(savedState?.movesRemaining || 0)
  const [currentPath, setCurrentPath] = useState(savedState?.currentPath || [])

  // Win state
  const [winner, setWinner] = useState(null) // { player: 1 or 2, name, path, loserPos }
  const [winToggle, setWinToggle] = useState(true) // toggles every 500ms for animation

  // First turn flag - human visible to pet on first turn only
  const [isFirstTurn, setIsFirstTurn] = useState(savedState?.isFirstTurn !== false)

  // Rules popup
  const [showRules, setShowRules] = useState(false)

  // Treat system
  const [treatsOnBoard, setTreatsOnBoard] = useState(savedState?.treatsOnBoard || []) // [{row, col, placedOrder}]
  const [petScore, setPetScore] = useState(savedState?.petScore || 0)
  const [takenTreatLocations, setTakenTreatLocations] = useState(savedState?.takenTreatLocations || []) // [{row, col}]
  const [humanLastPath, setHumanLastPath] = useState(savedState?.humanLastPath || [])
  const [isPlacingTreat, setIsPlacingTreat] = useState(savedState?.isPlacingTreat || false)
  const [treatPlaceOrder, setTreatPlaceOrder] = useState(savedState?.treatPlaceOrder || 0) // counter for FIFO
  const [currentTurnTreat, setCurrentTurnTreat] = useState(savedState?.currentTurnTreat || null) // treat placed this turn {row, col}
  const [pendingCollectedTreats, setPendingCollectedTreats] = useState(savedState?.pendingCollectedTreats || []) // treats collected but not yet revealed to human

  // Calculate remaining treats for human (3 total - on board - collected by pet)
  const humanTreatsRemaining = 3 - treatsOnBoard.length - petScore

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      gameState,
      player1,
      player2,
      currentTurn,
      player1Pos,
      player2Pos,
      dice1,
      dice2,
      isMoving,
      movesRemaining,
      currentPath,
      isFirstTurn,
      treatsOnBoard,
      petScore,
      takenTreatLocations,
      humanLastPath,
      isPlacingTreat,
      treatPlaceOrder,
      currentTurnTreat,
      pendingCollectedTreats
    }
    localStorage.setItem('petsitter-game', JSON.stringify(stateToSave))
  }, [gameState, player1, player2, currentTurn, player1Pos, player2Pos, dice1, dice2, isMoving, movesRemaining, currentPath, isFirstTurn, treatsOnBoard, petScore, takenTreatLocations, humanLastPath, isPlacingTreat, treatPlaceOrder, currentTurnTreat, pendingCollectedTreats])

  // Listen for shift key to toggle location visibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        setRevealLocation(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Win animation toggle every 500ms
  useEffect(() => {
    if (!winner) return

    const interval = setInterval(() => {
      setWinToggle(prev => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [winner])

  const startGame = () => {
    // Place players in random positions
    setPlayer1Pos({
      row: Math.floor(Math.random() * BOARD_HEIGHT),
      col: Math.floor(Math.random() * BOARD_WIDTH)
    })
    setPlayer2Pos({
      row: Math.floor(Math.random() * BOARD_HEIGHT),
      col: Math.floor(Math.random() * BOARD_WIDTH)
    })
    setRevealLocation(false)
    setIsFirstTurn(true)
    setTreatsOnBoard([])
    setPetScore(0)
    setTakenTreatLocations([])
    setHumanLastPath([])
    setIsPlacingTreat(false)
    setTreatPlaceOrder(0)
    setCurrentTurnTreat(null)
    setGameState('playing')
    setCurrentTurn(1)
  }

  const rollDice = useCallback(() => {
    if (rolling || isMoving) return

    setRolling(true)

    // Clear any existing timeouts
    rollTimeoutRef.current.forEach(t => clearTimeout(t))
    rollTimeoutRef.current = []

    // Calculate roll schedule - starts fast, slows down
    const intervals = []
    let time = 0
    let interval = 100

    while (time < 4000) {
      intervals.push(time)
      time += interval
      interval *= 1.15
    }

    // Track final dice values
    let finalDice1 = 1
    let finalDice2 = 1

    // Schedule all the dice changes
    intervals.forEach((t) => {
      const timeout = setTimeout(() => {
        finalDice1 = Math.floor(Math.random() * 6) + 1
        finalDice2 = Math.floor(Math.random() * 6) + 1
        setDice1(finalDice1)
        if (currentTurn === 2) {
          setDice2(finalDice2)
        }
        playClick()
      }, t)
      rollTimeoutRef.current.push(timeout)
    })

    // End rolling and start movement phase
    const endTimeout = setTimeout(() => {
      setRolling(false)
      // Pet gets 1 dice, human gets 2
      const totalMoves = currentTurn === 1 ? finalDice1 : finalDice1 + finalDice2
      setMovesRemaining(totalMoves)
      const startPos = currentTurn === 1 ? player1Pos : player2Pos
      setCurrentPath([startPos])
      setIsMoving(true)
    }, intervals[intervals.length - 1] + 100)
    rollTimeoutRef.current.push(endTimeout)

  }, [rolling, isMoving, currentTurn, player1Pos, player2Pos])

  // Check if a cell is adjacent to another cell (orthogonally)
  const isAdjacent = (pos1, pos2) => {
    const rowDiff = Math.abs(pos1.row - pos2.row)
    const colDiff = Math.abs(pos1.col - pos2.col)
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
  }

  // Check if a position is in the current path
  const isInPath = (pos) => {
    return currentPath.some(p => p.row === pos.row && p.col === pos.col)
  }

  // Get current player's position (last position in path during movement)
  const getCurrentPos = () => {
    if (isMoving && currentPath.length > 0) {
      return currentPath[currentPath.length - 1]
    }
    return currentTurn === 1 ? player1Pos : player2Pos
  }

  // Check if a cell is a valid move
  const isValidMove = (cellRow, cellCol) => {
    if (!isMoving || movesRemaining <= 0) return false
    const currentPos = getCurrentPos()
    const targetPos = { row: cellRow, col: cellCol }
    return isAdjacent(currentPos, targetPos) && !isInPath(targetPos)
  }

  // Check if a cell is the previous position (for undo)
  const isPreviousPos = (cellRow, cellCol) => {
    if (!isMoving || currentPath.length < 2) return false
    const prevPos = currentPath[currentPath.length - 2]
    return prevPos.row === cellRow && prevPos.col === cellCol
  }

  // Handle clicking on a cell to move or place treat
  const handleCellClick = (cellRow, cellCol) => {
    // Handle treat placement
    if (isPlacingTreat && revealLocation) {
      placeTreat(cellRow, cellCol)
      return
    }

    if (!revealLocation || !isMoving) return

    // Check if clicking on previous position to undo
    if (isPreviousPos(cellRow, cellCol)) {
      setCurrentPath(prev => prev.slice(0, -1))
      setMovesRemaining(prev => prev + 1)
      return
    }

    if (!isValidMove(cellRow, cellCol)) return

    const newPos = { row: cellRow, col: cellCol }
    setCurrentPath(prev => [...prev, newPos])
    setMovesRemaining(prev => prev - 1)
  }

  // Check if a path intercepts a position
  const pathInterceptsPos = (path, pos) => {
    return path.some(p => p.row === pos.row && p.col === pos.col)
  }

  // Check if a cell is adjacent (8 directions) to a position
  const isAdjacentDiagonal = (pos1, pos2) => {
    const rowDiff = Math.abs(pos1.row - pos2.row)
    const colDiff = Math.abs(pos1.col - pos2.col)
    return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)
  }

  // Check if a cell is valid for treat placement (on or adjacent to path, not on final position)
  const isValidTreatPlacement = (cellRow, cellCol) => {
    if (!isPlacingTreat) return false
    const targetPos = { row: cellRow, col: cellCol }

    // Can't place on human's final position
    if (cellRow === player2Pos.row && cellCol === player2Pos.col) return false

    // Can't place on existing treat (except current turn's treat which can be moved)
    const isCurrentTurnTreat = currentTurnTreat && cellRow === currentTurnTreat.row && cellCol === currentTurnTreat.col
    if (!isCurrentTurnTreat && treatsOnBoard.some(t => t.row === cellRow && t.col === cellCol)) return false

    // Must be on the path OR adjacent to any path square
    const isOnPath = humanLastPath.some(p => p.row === cellRow && p.col === cellCol)
    const isAdjacentToPath = humanLastPath.some(p => isAdjacentDiagonal(targetPos, p))

    return isOnPath || isAdjacentToPath
  }

  // Handle treat placement (can reposition until finish turn)
  const placeTreat = (cellRow, cellCol) => {
    if (!isValidTreatPlacement(cellRow, cellCol)) return

    const newTreatPos = { row: cellRow, col: cellCol }

    // If already placed a treat this turn, move it instead
    if (currentTurnTreat) {
      // Remove the current turn's treat and place at new location
      const treatsWithoutCurrent = treatsOnBoard.filter(
        t => !(t.row === currentTurnTreat.row && t.col === currentTurnTreat.col)
      )
      setTreatsOnBoard([...treatsWithoutCurrent, { ...newTreatPos, placedOrder: treatPlaceOrder }])
    } else {
      // First placement this turn
      if (humanTreatsRemaining > 0) {
        // Has treats left - place new one
        setTreatsOnBoard([...treatsOnBoard, { ...newTreatPos, placedOrder: treatPlaceOrder }])
        setTreatPlaceOrder(prev => prev + 1)
      } else {
        // No treats left - recycle oldest treat (FIFO)
        const sortedTreats = [...treatsOnBoard].sort((a, b) => a.placedOrder - b.placedOrder)
        const treatsWithoutOldest = sortedTreats.slice(1)
        setTreatsOnBoard([...treatsWithoutOldest, { ...newTreatPos, placedOrder: treatPlaceOrder }])
        setTreatPlaceOrder(prev => prev + 1)
      }
    }

    setCurrentTurnTreat(newTreatPos)
  }

  // Finish human's turn after placing treat
  const finishTurn = () => {
    if (!currentTurnTreat) return
    setIsPlacingTreat(false)
    setCurrentTurnTreat(null)
    setRevealLocation(false)
    setCurrentTurn(1) // Switch to pet's turn
  }

  // Finish the move and switch turns (or trigger win)
  const finishMove = () => {
    if (movesRemaining > 0 || !isMoving) return

    const finalPos = currentPath[currentPath.length - 1]

    // Check for collision win condition - Human (Player 2) wins if paths cross
    const otherPlayerPos = currentTurn === 1 ? player2Pos : player1Pos
    const pathHitsOther = pathInterceptsPos(currentPath, otherPlayerPos)

    if (pathHitsOther) {
      // Human wins! (Player 2 is always the winner)
      setWinner({
        player: 2,
        name: player2.name,
        winningPath: currentPath,
        winnerFinalPos: currentTurn === 2 ? finalPos : player2Pos,
        loserPos: currentTurn === 1 ? finalPos : player1Pos,
        whoMoved: currentTurn
      })
      if (currentTurn === 1) {
        setPlayer1Pos(finalPos)
      } else {
        setPlayer2Pos(finalPos)
      }
      setIsMoving(false)
      setCurrentPath([])
      return
    }

    // Pet's turn - check for treat collection
    if (currentTurn === 1) {
      const collectedTreats = treatsOnBoard.filter(treat =>
        currentPath.some(p => p.row === treat.row && p.col === treat.col)
      )

      if (collectedTreats.length > 0) {
        // Add to pending (human won't see X until after their Finish Move)
        const newPending = [...pendingCollectedTreats, ...collectedTreats.map(t => ({ row: t.row, col: t.col }))]
        setPendingCollectedTreats(newPending)

        // Remove collected treats from board
        const remainingTreats = treatsOnBoard.filter(treat =>
          !currentPath.some(p => p.row === treat.row && p.col === treat.col)
        )
        setTreatsOnBoard(remainingTreats)

        // Add to pet score
        const newPetScore = petScore + collectedTreats.length
        setPetScore(newPetScore)

        // Check if pet wins by collecting all 3 treats
        if (newPetScore >= 3) {
          setWinner({
            player: 1,
            name: player1.name,
            winningPath: currentPath,
            winnerFinalPos: finalPos,
            loserPos: player2Pos,
            whoMoved: 1
          })
          setPlayer1Pos(finalPos)
          setIsMoving(false)
          setCurrentPath([])
          return
        }
      }

      setPlayer1Pos(finalPos)
      if (isFirstTurn) {
        setIsFirstTurn(false)
      }
      setIsMoving(false)
      setCurrentPath([])
      setRevealLocation(false)
      setCurrentTurn(2)
    } else {
      // Human's turn - reveal any pending collected treats (X markers and count update)
      if (pendingCollectedTreats.length > 0) {
        setTakenTreatLocations([...takenTreatLocations, ...pendingCollectedTreats])
        setPendingCollectedTreats([])
      }

      // Human's turn - enter treat placement phase
      setPlayer2Pos(finalPos)
      setHumanLastPath([...currentPath]) // Save path for smell mechanic
      setIsMoving(false)
      setCurrentPath([])
      setIsPlacingTreat(true)
      setRevealLocation(true) // Auto-reveal for treat placement
      // Don't switch turn yet - wait for treat placement
    }
  }

  // Get player colors
  const player1Color = PRIMARY_COLORS[player1.colorIndex].value
  const player2Color = SECONDARY_COLORS[player2.colorIndex].value
  const player1Avatar = PET_AVATARS[player1.avatarIndex]
  const player2Avatar = SITTER_AVATARS[player2.avatarIndex]

  // Check if any smell squares are visible (for contextual hint)
  const hasVisibleSmell = currentTurn === 1 && revealLocation && !isMoving && treatsOnBoard.some(treat =>
    humanLastPath.some(pathPos => isAdjacentDiagonal(pathPos, treat))
  )

  // Create simple grid
  const grid = Array.from({ length: BOARD_HEIGHT }, (_, row) =>
    Array.from({ length: BOARD_WIDTH }, (_, col) => ({
      row,
      col,
    }))
  )

  if (gameState === 'setup') {
    return (
      <SetupScreen
        onStartGame={startGame}
        player1={player1}
        player2={player2}
        setPlayer1={setPlayer1}
        setPlayer2={setPlayer2}
      />
    )
  }

  return (
    <div className="game">
      <header className="header">
        <h1 className="title">~*~ PetSitter ~*~</h1>
      </header>
      <div className="game-area">
        <div className="left-gutter">
          <div className="gutter-player">
            {currentTurn === 1 && !isPlacingTreat && <div className="turn-banner" style={{ backgroundColor: player1Color }}>YOUR TURN</div>}
            <div className="gutter-player-name" style={{ color: player1Color }}>{player1.name}</div>
            <pre className="gutter-player-avatar" style={{ color: player1Color }}>{player1Avatar.art}</pre>
            {(() => {
              // Show fake pet score to human (don't reveal pending collected treats until after Finish Move)
              const visiblePetScore = currentTurn === 2 && !isPlacingTreat
                ? petScore - pendingCollectedTreats.length
                : petScore
              return visiblePetScore > 0 && (
                <div className="treat-score" style={{ color: player1Color }}>
                  {Array(visiblePetScore).fill(PET_TREATS[player1Avatar.name]?.icon || 'o').join(' ')}
                </div>
              )
            })()}
          </div>
          <div className="gutter-player">
            {currentTurn === 2 && !isPlacingTreat && <div className="turn-banner" style={{ backgroundColor: player2Color }}>YOUR TURN</div>}
            {isPlacingTreat && <div className="turn-banner" style={{ backgroundColor: player2Color }}>PLACE TREAT</div>}
            <div className="gutter-player-name" style={{ color: player2Color }}>{player2.name}</div>
            <pre className="gutter-player-avatar" style={{ color: player2Color }}>{player2Avatar.art}</pre>
          </div>
          <button
            className="show-me-btn"
            onClick={() => setRevealLocation(prev => !prev)}
          >
            Show Me
          </button>
          <div className="dice-area">
            <div className="dice-container" onClick={rolling || isMoving || isPlacingTreat ? undefined : rollDice} style={{ cursor: (isMoving || isPlacingTreat) ? 'default' : 'pointer' }}>
              <Dice value={dice1} rolling={rolling} active={rolling || isMoving} />
              {(currentTurn === 2 || isPlacingTreat) && <Dice value={dice2} rolling={rolling} active={rolling || isMoving} />}
            </div>
            <div className="moves-area">
              {isMoving && (
                <>
                  <div className="moves-counter">{movesRemaining}</div>
                  <button
                    className="finish-move-btn"
                    onClick={finishMove}
                    disabled={movesRemaining > 0}
                  >
                    {currentTurn === 1 ? 'Finish Turn' : 'Finish Move'}
                  </button>
                </>
              )}
              {isPlacingTreat && (
                <>
                  <div className="treat-prompt">
                    {currentTurnTreat ? 'Click another spot to move treat' : 'Click a highlighted square to place treat'}
                  </div>
                  {currentTurnTreat && (
                    <button
                      className="finish-move-btn"
                      onClick={finishTurn}
                    >
                      Finish Turn
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="treats-remaining">
            {humanTreatsRemaining > 0 && (
              <>
                <div className="treat-label">{PET_TREATS[player1Avatar.name]?.name || 'Treats'}</div>
                {Array(humanTreatsRemaining).fill(null).map((_, i) => (
                  <div key={i} className="treat-bone">{PET_TREATS[player1Avatar.name]?.icon || 'o'}</div>
                ))}
              </>
            )}
          </div>
          <button className="rules-btn" onClick={() => setShowRules(true)}>
            Rules
          </button>
          <button className="end-game-btn" onClick={() => {
            setGameState('setup')
            setIsMoving(false)
            setCurrentPath([])
            setMovesRemaining(0)
            setIsPlacingTreat(false)
            setTreatsOnBoard([])
            setPetScore(0)
            setTakenTreatLocations([])
            setHumanLastPath([])
            setCurrentTurnTreat(null)
            setPendingCollectedTreats([])
            setTreatPlaceOrder(0)
            setWinner(null)
          }}>
            End Game
          </button>
        </div>
        <div className="board-wrapper">
          {hasVisibleSmell && (
            <div className="smell-hint" style={{ color: player2Color }}>
              You smell the sitter nearby...
            </div>
          )}
          <div className="board">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell) => {
                // Win state rendering
                if (winner) {
                  const isInWinPath = winner.winningPath.some(p => p.row === cell.row && p.col === cell.col)
                  const isWinnerPos = cell.row === winner.winnerFinalPos.row && cell.col === winner.winnerFinalPos.col
                  const isLoserPos = cell.row === winner.loserPos.row && cell.col === winner.loserPos.col

                  let cellStyle = {}
                  let showAvatar = null
                  let avatarColor = '#000'

                  // Player squares are inverse of path: when path is white, players are black and vice versa
                  const winnerAvatar = winner.player === 1 ? player1Avatar : player2Avatar
                  const loserAvatar = winner.player === 1 ? player2Avatar : player1Avatar
                  if (isWinnerPos) {
                    cellStyle.backgroundColor = winToggle ? '#000' : '#fff'
                    avatarColor = winToggle ? '#fff' : '#000'
                    showAvatar = winnerAvatar.art
                  } else if (isLoserPos) {
                    cellStyle.backgroundColor = winToggle ? '#000' : '#fff'
                    avatarColor = winToggle ? '#fff' : '#000'
                    showAvatar = loserAvatar.art
                  } else if (isInWinPath && winToggle && winner.player === 2) {
                    // Rest of path toggles on/off (white when on) - only for human win
                    cellStyle.backgroundColor = '#fff'
                  }

                  return (
                    <div
                      key={`${cell.row}-${cell.col}`}
                      className="cell"
                      style={cellStyle}
                    >
                      {showAvatar && <pre className="cell-avatar" style={{ color: avatarColor }}>{showAvatar}</pre>}
                    </div>
                  )
                }

                const isPlayer1Here = cell.row === player1Pos.row && cell.col === player1Pos.col
                const isPlayer2Here = cell.row === player2Pos.row && cell.col === player2Pos.col
                const showPlayer1 = isPlayer1Here && revealLocation && currentTurn === 1 && !isMoving && !isPlacingTreat
                const showPlayer2 = isPlayer2Here && revealLocation && (currentTurn === 2 || isPlacingTreat) && !isMoving
                // Show human to pet on first turn so they can avoid collision
                const showHumanFirstTurn = isPlayer2Here && revealLocation && isFirstTurn && currentTurn === 1

                // Treat on this cell (include pending treats for human - they don't know they're taken yet)
                const treatHere = treatsOnBoard.find(t => t.row === cell.row && t.col === cell.col)
                const pendingTreatHere = pendingCollectedTreats.find(t => t.row === cell.row && t.col === cell.col)
                // Show pending treats to human as if they're still there
                const showPendingAsReal = pendingTreatHere && currentTurn === 2 && !isPlacingTreat
                // Taken treat X marker on this cell (only revealed ones, not pending)
                const takenTreatHere = takenTreatLocations.find(t => t.row === cell.row && t.col === cell.col)

                // Smell mechanic - check if this cell is near a treat and was part of human's last path
                const isNearTreat = treatsOnBoard.some(treat => isAdjacentDiagonal({ row: cell.row, col: cell.col }, treat))
                const wasInHumanPath = humanLastPath.some(p => p.row === cell.row && p.col === cell.col)
                const showSmell = currentTurn === 1 && revealLocation && isNearTreat && wasInHumanPath && !isMoving

                // Movement rendering (only visible when holding shift)
                const cellInPath = isInPath({ row: cell.row, col: cell.col })
                const isCurrentMovePos = isMoving && currentPath.length > 0 &&
                  currentPath[currentPath.length - 1].row === cell.row &&
                  currentPath[currentPath.length - 1].col === cell.col
                const isStartingPos = isMoving && currentPath.length > 0 &&
                  currentPath[0].row === cell.row &&
                  currentPath[0].col === cell.col
                const validMove = isValidMove(cell.row, cell.col)
                const canUndo = isPreviousPos(cell.row, cell.col)

                // Treat placement
                const validTreatSpot = isValidTreatPlacement(cell.row, cell.col)

                const currentColor = currentTurn === 1 ? player1Color : player2Color
                const currentAvatar = currentTurn === 1 ? player1Avatar : player2Avatar

                let cellStyle = {}
                let cellClass = 'cell'
                let cellContent = null

                // Show treats to pet when revealing, or to human always when their turn
                // Also show pending treats to human as if they're still there (before Finish Move)
                const showTreat = (treatHere || showPendingAsReal) && revealLocation && (currentTurn === 1 || currentTurn === 2 || isPlacingTreat)
                // Show X markers to both players when revealing (only revealed ones, not pending)
                const showTakenX = takenTreatHere && revealLocation

                // Show human's path during treat placement
                const cellInHumanPath = humanLastPath.some(p => p.row === cell.row && p.col === cell.col)
                const isHumanFinalPos = cell.row === player2Pos.row && cell.col === player2Pos.col

                // Only show path and valid moves when shift is toggled on
                if (revealLocation) {
                  if (cellInPath && isMoving) {
                    // Starting square gets stronger color
                    if (isStartingPos) {
                      cellStyle.backgroundColor = currentColor + 'AA' // ~67% opacity
                    } else {
                      cellStyle.backgroundColor = currentColor + '80' // ~50% opacity
                    }
                  }
                  // Show human's path during treat placement
                  if (isPlacingTreat && cellInHumanPath && !isHumanFinalPos) {
                    cellStyle.backgroundColor = player2Color + '80' // ~50% opacity
                  }
                  if (validMove) {
                    cellClass += ' valid-move'
                    cellStyle.boxShadow = `inset 0 0 0 3px ${currentColor}`
                    cellStyle.cursor = 'pointer'
                  }
                  if (canUndo) {
                    cellStyle.boxShadow = `inset 0 0 0 3px #888`
                    cellStyle.cursor = 'pointer'
                  }
                  // Smell - show human path near treats (for pet)
                  if (showSmell) {
                    cellStyle.backgroundColor = player2Color + '50'
                  }
                  // Valid treat placement spot - use CSS class for padded outline
                  if (validTreatSpot) {
                    cellClass += ' valid-treat-spot'
                    cellStyle.cursor = 'pointer'
                  }
                }

                return (
                  <div
                    key={`${cell.row}-${cell.col}`}
                    className={cellClass}
                    style={cellStyle}
                    onClick={() => handleCellClick(cell.row, cell.col)}
                  >
                    {showPlayer1 && <pre className="cell-avatar" style={{ color: player1Color }}>{player1Avatar.art}</pre>}
                    {showPlayer2 && <pre className="cell-avatar" style={{ color: player2Color }}>{player2Avatar.art}</pre>}
                    {showHumanFirstTurn && <pre className="cell-avatar" style={{ color: player2Color }}>{player2Avatar.art}</pre>}
                    {isCurrentMovePos && revealLocation && <pre className="cell-avatar" style={{ color: currentColor }}>{currentAvatar.art}</pre>}
                    {showTreat && <div className="cell-treat">{PET_TREATS[player1Avatar.name]?.icon || 'o'}</div>}
                    {showTakenX && <div className="cell-taken-x" style={{ color: player1Color }}>X</div>}
                  </div>
                )
              })}
            </div>
          ))}
          </div>
        </div>
      </div>
      {winner ? (
        <div className="winner-section">
          <h2
            className="winner-text"
            style={{
              color: winToggle ? (winner.player === 1 ? player1Color : player2Color) : 'transparent',
            }}
          >
            {winner.name} Wins!
          </h2>
          <button className="end-game-btn" onClick={() => {
            setGameState('setup')
            setIsMoving(false)
            setCurrentPath([])
            setMovesRemaining(0)
            setWinner(null)
            setIsPlacingTreat(false)
            setTreatsOnBoard([])
            setPetScore(0)
            setTakenTreatLocations([])
            setHumanLastPath([])
            setCurrentTurnTreat(null)
            setPendingCollectedTreats([])
            setTreatPlaceOrder(0)
          }}>
            Play Again
          </button>
        </div>
      ) : (
        <div className="game-instruction" style={{ color: isPlacingTreat ? player2Color : (currentTurn === 1 ? player1Color : player2Color) }}>
          {!isMoving && !rolling && !isPlacingTreat && `${currentTurn === 1 ? player1.name : player2.name} roll dice`}
          {isMoving && movesRemaining > 0 && `${currentTurn === 1 ? player1.name : player2.name} move on board`}
          {isMoving && movesRemaining === 0 && `${currentTurn === 1 ? player1.name : player2.name} finish turn`}
          {isPlacingTreat && !currentTurnTreat && `${player2.name} place a treat`}
          {isPlacingTreat && currentTurnTreat && `${player2.name} finish turn or move treat`}
        </div>
      )}
      {showRules && (
        <div className="rules-overlay" onClick={() => setShowRules(false)}>
          <div className="rules-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Rules</h3>
            <div className="rules-section">
              <h4>HOW TO WIN</h4>
              <p><strong>Pet:</strong> Collect all 3 treats scattered by the Sitter</p>
              <p><strong>Sitter:</strong> Catch the Pet by crossing paths with them</p>
            </div>
            <div className="rules-section">
              <h4>GAMEPLAY</h4>
              <ul>
                <li>Players can't see each other (hidden by default)</li>
                <li>Both players CAN see treat locations</li>
                <li>Pet rolls 1 die, Sitter rolls 2 dice</li>
                <li>Move by clicking adjacent cells (no diagonals)</li>
                <li>Hold SHIFT or click "Show Me" to reveal your position</li>
              </ul>
            </div>
            <div className="rules-section">
              <h4>SMELL MECHANIC</h4>
              <p>The Pet can "smell" the Sitter - when revealing, highlighted squares near treats show where the Sitter has recently walked.</p>
            </div>
            <div className="rules-section">
              <h4>HIDDEN INFORMATION</h4>
              <p>When the Pet collects a treat, the Sitter doesn't know until after their next move (before placing a new treat). The treat appears collected with an X.</p>
            </div>
            <div className="rules-section">
              <h4>FIRST TURN</h4>
              <p>On the first turn only, the Pet can see the Sitter's starting position to help avoid immediate collision.</p>
            </div>
            <button className="rules-close-btn" onClick={() => setShowRules(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
