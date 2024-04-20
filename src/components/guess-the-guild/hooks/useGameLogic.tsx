import useLocalStorage from "hooks/useLocalStorage"
import { useEffect, useState } from "react"
import { Difficulty, GameMode, GameState } from "../guess-the-guild-types"

// The amount of points that a right answer in a game mode yields
export const GAME_MODE_POINTS: Record<GameMode, number> = {
  [GameMode.GuessNameMode]: 1,
  [GameMode.AssignLogosMode]: 2,
}

// The earned points get multiplied by this factor depending upon the difficulty
export const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
  [Difficulty.Easy]: 1,
  [Difficulty.Medium]: 2,
  [Difficulty.Hard]: 3,
}

const useGameLogic = () => {
  const [savedHighscore, setSavedHighscore] = useLocalStorage("highscore", 0)
  const [score, setScore] = useState(0)
  const [highscore, setHighscore] = useState(0)
  const [round, setRound] = useState(0)
  const [gameState, setGameState] = useState<GameState>(GameState.Start)
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.GuessNameMode)
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy)

  useEffect(() => {
    setHighscore(savedHighscore)
  }, [savedHighscore])

  const addPoints = () => {
    const pointsToAdd =
      GAME_MODE_POINTS[gameMode] * DIFFICULTY_MULTIPLIERS[difficulty]
    const updatedPoints = score + pointsToAdd
    setScore(updatedPoints)
    updateHighscore(updatedPoints)
  }

  const updateHighscore = (updatedPoints: number) => {
    if (updatedPoints > highscore) {
      setSavedHighscore(updatedPoints)
    }
  }

  const restartGame = () => {
    setScore(0)
    setRound(0)
    setHighscore(savedHighscore)
    setGameState(GameState.Start)
  }

  const startGame = () => {
    setGameState(GameState.Game)
    selectGameMode()
  }

  const selectGameMode = () => {
    if (Math.random() >= 0.5) {
      setGameMode(GameMode.AssignLogosMode)
    } else {
      setGameMode(GameMode.GuessNameMode)
    }
  }

  const endGame = () => {
    setGameState(GameState.End)
  }

  const nextGame = () => {
    selectGameMode()
    setRound(round + 1)
  }

  return {
    state: { score, highscore, round, difficulty, gameMode, gameState },
    transition: { startGame, endGame, restartGame, nextGame },
    action: { setDifficulty, addPoints },
  }
}

export default useGameLogic
