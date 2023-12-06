import { Container, useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import AssignLogos from "components/guess-the-guild/AssignLogos"
import EndGame from "components/guess-the-guild/EndGame"
import GuessName from "components/guess-the-guild/GuessName"
import ScoreIndicator from "components/guess-the-guild/ScoreIndicator"
import StartGame from "components/guess-the-guild/StartGame"
import {
  Difficulty,
  GameMode,
  GameState,
} from "components/guess-the-guild/guess-the-guild-types"
import useGameLogic from "components/guess-the-guild/useGameLogic"
import React from "react"
import { GuildBase } from "types"

const GuessTheGuild = (): JSX.Element => {
  const gameLogic = useGameLogic()

  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#37373a")
  const bgOpacity = useColorModeValue(0.06, 0.1)
  const bgLinearPercentage = useBreakpointValue({ base: "50%", sm: "55%" })

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

  const handleStart = () => {
    gameLogic.transition.startGame()
  }

  const handleNext = () => {
    gameLogic.transition.nextGame()
  }

  const handleDifficultyChange = (diff: Difficulty) => {
    gameLogic.action.setDifficulty(diff)
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
          {/* Show points indicator when the game is on */}
          {gameLogic.state.gameState === GameState.Game && (
            <ScoreIndicator
              score={gameLogic.state.score}
              highscore={gameLogic.state.highscore}
            />
          )}

          <Card mt="0px" py="7" px="4">
            {/* Start Screen */}
            {gameLogic.state.gameState === GameState.Start && (
              <StartGame
                onStart={handleStart}
                highscore={gameLogic.state.highscore}
                onDifficultyChange={handleDifficultyChange}
                difficulty={gameLogic.state.difficulty}
              />
            )}

            {/* Game Screen */}
            {gameLogic.state.gameState === GameState.Game && (
              <React.Fragment key={gameLogic.state.round}>
                {/* Name Guessing Mode */}
                {gameLogic.state.gameMode === GameMode.AssignLogosMode && (
                  <>
                    <AssignLogos
                      guilds={mockGuilds}
                      onNext={handleNext}
                      onExit={() => gameLogic.transition.endGame()}
                      onCorrect={() => gameLogic.action.addPoints(2)}
                    />
                  </>
                )}

                {/* Assign Logo Mode */}
                {gameLogic.state.gameMode === GameMode.GuessNameMode && (
                  <>
                    <GuessName
                      guilds={mockGuilds}
                      onNext={handleNext}
                      onExit={() => gameLogic.transition.endGame()}
                      onCorrect={() => gameLogic.action.addPoints(1)}
                    />
                  </>
                )}
              </React.Fragment>
            )}

            {/* End Screen */}
            {gameLogic.state.gameState === GameState.End && (
              <EndGame
                onRestart={gameLogic.transition.restartGame}
                highscore={gameLogic.state.highscore}
                score={gameLogic.state.score}
              />
            )}
          </Card>
        </Container>
      </Layout>
    </>
  )
}

export default GuessTheGuild
