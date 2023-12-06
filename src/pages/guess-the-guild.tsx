import { Container, useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import AssignLogos from "components/guess-the-guild/AssignLogos"
import EndGame from "components/guess-the-guild/EndGame"
import GuessName from "components/guess-the-guild/GuessName"
import ScoreIndicator from "components/guess-the-guild/ScoreIndicator"
import StartGame from "components/guess-the-guild/StartGame"
import React, { useState } from "react"
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
}

const GuessTheGuild = (): JSX.Element => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#37373a")
  const bgOpacity = useColorModeValue(0.06, 0.1)
  const bgLinearPercentage = useBreakpointValue({ base: "50%", sm: "55%" })

  const [round, setRound] = useState(0)
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.GuessNameMode)
  const [gameState, setGameState] = useState<GameState>(GameState.Start)

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
          <ScoreIndicator />
          <Card mt="0px" py="7" px="4">
            {gameState === GameState.Start && (
              <StartGame onStart={() => startGame()} />
            )}

            {gameState === GameState.Game && (
              <React.Fragment key={round}>
                {gameMode === GameMode.AssignLogosMode && (
                  <>
                    <AssignLogos
                      guilds={mockGuilds}
                      onNext={() => nextGame()}
                      onExit={() => endGame()}
                    />
                  </>
                )}

                {gameMode === GameMode.GuessNameMode && (
                  <>
                    <GuessName
                      guilds={mockGuilds}
                      onNext={() => nextGame()}
                      onExit={() => endGame()}
                    />
                  </>
                )}
              </React.Fragment>
            )}

            {gameState === GameState.End && (
              <EndGame onRestart={() => restartGame()} />
            )}
          </Card>
        </Container>
      </Layout>
    </>
  )
}

export default GuessTheGuild
