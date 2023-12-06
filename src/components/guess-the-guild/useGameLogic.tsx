import useLocalStorage from "hooks/useLocalStorage"
import { useEffect, useState } from "react"
import { Difficulty, GameMode, GameState } from "./guess-the-guild-types"

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
  }, [])

  const addPoints = (points: number) => {
    let pointsToAdd = points
    if (difficulty === Difficulty.Medium) pointsToAdd *= 2
    if (difficulty === Difficulty.Hard) pointsToAdd *= 3
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
