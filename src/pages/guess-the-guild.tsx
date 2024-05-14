import { Button, Center, HStack, Text, useColorModeValue } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import GuessTheGuild from "components/guess-the-guild/GuessTheGuild"
import PairTheGuild from "components/guess-the-guild/PairTheGuild"
import SelectGameLevel from "components/guess-the-guild/SelectGameLevel"
import useLocalStorage from "hooks/useLocalStorage"
import { useState } from "react"
import useSWRImmutable from "swr/immutable"
import { GameLevel, GameMode, GuildBase } from "types"

const Page = (): JSX.Element => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#3f4044")
  const [gameInProgress, setGameInProgress] = useState<boolean>(false)

  const getRandomGameMode = (): GameMode =>
    possibleGameModes[Math.floor(Math.random() * possibleGameModes.length)]
  const possibleGameModes: GameMode[] = ["GuessTheGuild", "PairTheGuild"]
  const [gameMode, setGameMode] = useState<GameMode>(getRandomGameMode())

  const [selectedLevel, setSelectedLevel] = useState<GameLevel>(GameLevel.Easy)
  const [levelSelectDisable, setLevelSelectDisable] = useState<boolean>()
  const [record, setRecord] = useLocalStorage("guess-the-guild-record", 0)
  const [points, setPoints] = useState<number>(0)

  const title: string = gameInProgress
    ? gameMode === "GuessTheGuild"
      ? "Guess the guild by the logo"
      : "Pair the logos to their guilds"
    : "Choose a difficulty level and press the button"

  const onFinishedGuessTheGuildRound = (pointsReceived: number) => {
    if (pointsReceived === 0 && record < points) setRecord(points)
    setPoints(pointsReceived > 0 ? points + pointsReceived : pointsReceived)
    setGameMode(getRandomGameMode())
  }
  const { data } = useSWRImmutable<GuildBase[]>(
    `/v2/guilds?order=FEATURED&limit=${selectedLevel}`
  )

  const onStartGame = () => {
    setGameInProgress(true)
    setLevelSelectDisable(true)
  }

  return (
    <>
      <Layout
        title="Guess the Guild"
        background={bgColor}
        backgroundProps={{
          opacity: 1,
        }}
        textColor="white"
        maxWidth="container.sm"
      >
        <HStack justifyContent="space-between">
          <Text as="span" fontWeight="bold">
            Record: {record}
          </Text>
          <SelectGameLevel
            selected={selectedLevel}
            levelSelectDisable={levelSelectDisable}
            onSelect={setSelectedLevel}
          ></SelectGameLevel>
        </HStack>
        <Card
          data-test="guess-the-guild"
          pos="relative"
          py="6"
          px={{ base: 5, md: 6 }}
          bg="#37373a"
        >
          <Text as="span" fontSize="lg" fontWeight="bold" textAlign="center">
            {title}
          </Text>
          {gameInProgress && (
            <Text as="span" fontWeight="bold" textAlign="center" my="5">
              Current points: {points} {points > record && "(new high scrore!)"}
            </Text>
          )}
          {gameInProgress && (
            <>
              {gameMode === "GuessTheGuild" ? (
                <GuessTheGuild
                  guildData={data}
                  onLevelSelectDisable={setLevelSelectDisable}
                  finishedRound={onFinishedGuessTheGuildRound}
                ></GuessTheGuild>
              ) : (
                <PairTheGuild
                  guildData={data}
                  finishedRound={onFinishedGuessTheGuildRound}
                ></PairTheGuild>
              )}
            </>
          )}

          {!gameInProgress && (
            <Center mt="6">
              <Button colorScheme="green" onClick={onStartGame} isDisabled={!data}>
                Start game
              </Button>
            </Center>
          )}
        </Card>
      </Layout>
    </>
  )
}

export default Page
