import { Container, useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import AssignLogos from "components/guess-the-guild/AssignLogos"
import EndGame from "components/guess-the-guild/EndGame"
import GuessName from "components/guess-the-guild/GuessName"
import ScoreIndicator from "components/guess-the-guild/ScoreIndicator"
import StartGame from "components/guess-the-guild/StartGame"
import useLocalStorage from "hooks/useLocalStorage"
import React, { useEffect, useState } from "react"
import { GuildBase } from "types"

export enum GameMode {
  GuessNameMode,
  AssignLogosMode,
}

export enum GameState {
  Start,
  Game,
  End,
}

export type GameModeProps = {
  guilds: GuildBase[]
  onNext: () => void
  onExit: () => void
  onCorrect: () => void
}

export enum Difficulty {
  Easy,
  Medium,
  Hard,
}

const GuessTheGuild = (): JSX.Element => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#37373a")
  const bgOpacity = useColorModeValue(0.06, 0.1)
  const bgLinearPercentage = useBreakpointValue({ base: "50%", sm: "55%" })

  const [round, setRound] = useState(0)
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.GuessNameMode)
  const [gameState, setGameState] = useState<GameState>(GameState.Start)
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy)

  const [score, setScore] = useState(0)
  const [highscore, setHighscore] = useState(0)
  const [savedHighscore, setSavedHighscore] = useLocalStorage("highscore", 0)

  useEffect(() => {
    setHighscore(savedHighscore)
  }, [])

  const selectGameMode = () => {
    if (Math.random() >= 0.5) {
      setGameMode(GameMode.AssignLogosMode)
    } else {
      setGameMode(GameMode.GuessNameMode)
    }
  }

  const startGame = () => {
    setGameState(GameState.Game)
    selectGameMode()
  }

  const nextGame = () => {
    selectGameMode()
    setRound(round + 1)
  }

  const endGame = () => {
    setGameState(GameState.End)
  }

  const restartGame = () => {
    setRound(0)
    setGameState(GameState.Start)
  }

  const mockGuilds: GuildBase[] = [
    {
      id: 1,
      name: "Guild1",
      urlName: "guild1",
      imageUrl: "",
      roles: ["role1", "role2"],
      platforms: ["DISCORD"],
      memberCount: 12,
      rolesCount: 2,
      tags: ["FEATURED", "VERIFIED"],
    },
    {
      id: 2,
      name: "Guild2",
      urlName: "guild1",
      imageUrl: "",
      roles: ["role1", "role2"],
      platforms: ["DISCORD"],
      memberCount: 12,
      rolesCount: 2,
      tags: ["FEATURED", "VERIFIED"],
    },
    {
      id: 3,
      name: "Guild3",
      urlName: "guild1",
      imageUrl: "",
      roles: ["role1", "role2"],
      platforms: ["DISCORD"],
      memberCount: 12,
      rolesCount: 2,
      tags: ["FEATURED", "VERIFIED"],
    },
    {
      id: 4,
      name: "Guild4",
      urlName: "guild1",
      imageUrl: "",
      roles: ["role1", "role2"],
      platforms: ["DISCORD"],
      memberCount: 12,
      rolesCount: 2,
      tags: ["FEATURED", "VERIFIED"],
    },
  ]

  const addPoints = (points: number) => {
    let pointsToAdd = points
    if (difficulty === Difficulty.Medium) pointsToAdd *= 2
    if (difficulty === Difficulty.Hard) pointsToAdd *= 3
    const updatedPoints = points + pointsToAdd
    setScore(updatedPoints)
    updateHighscore(updatedPoints)
  }

  const updateHighscore = (updatedPoints: number) => {
    if (updatedPoints > highscore) {
      setSavedHighscore(updatedPoints)
    }
  }

  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff)
  }

  return (
    <>
      <Layout
        ogTitle={"Mini Game"}
        ogDescription="Are you an expert on Guilds? Test your knowledge!"
        background={bgColor}
        backgroundProps={{
          opacity: 1,
          _before: {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            bg: `linear-gradient(to top right, ${bgColor} ${bgLinearPercentage}, transparent), url('/banner.png ')`,
            bgSize: { base: "auto 100%", sm: "auto 115%" },
            bgRepeat: "no-repeat",
            bgPosition: "top 10px right 0px",
            opacity: bgOpacity,
          },
        }}
        backgroundOffset={200}
        textColor="white"
      >
        <Container p="0">
          {gameState === GameState.Game && (
            <ScoreIndicator score={score} highscore={highscore} />
          )}

          <Card mt="0px" py="7" px="4">
            {gameState === GameState.Start && (
              <StartGame
                onStart={() => startGame()}
                highscore={highscore}
                onDifficultyChange={handleDifficultyChange}
                difficulty={difficulty}
              />
            )}

            {gameState === GameState.Game && (
              <React.Fragment key={round}>
                {gameMode === GameMode.AssignLogosMode && (
                  <>
                    <AssignLogos
                      guilds={mockGuilds}
                      onNext={() => nextGame()}
                      onExit={() => endGame()}
                      onCorrect={() => addPoints(2)}
                    />
                  </>
                )}

                {gameMode === GameMode.GuessNameMode && (
                  <>
                    <GuessName
                      guilds={mockGuilds}
                      onNext={() => nextGame()}
                      onExit={() => endGame()}
                      onCorrect={() => addPoints(1)}
                    />
                  </>
                )}
              </React.Fragment>
            )}

            {gameState === GameState.End && (
              <EndGame onRestart={restartGame} highscore={highscore} score={score} />
            )}
          </Card>
        </Container>
      </Layout>
    </>
  )
}

export default GuessTheGuild
