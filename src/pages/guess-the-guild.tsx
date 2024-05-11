import { Button, Center, Text, useColorModeValue } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import GuessTheGuild from "components/guess-the-guild/GuessTheGuild"
import PairTheGuild from "components/guess-the-guild/PairTheGuild"
import SelectGameLevel from "components/guess-the-guild/SelectGameLevel"
import { useState } from "react"
import useSWRImmutable from "swr/immutable"
import { GameLevel, GameMode, GuildBase } from "types"

/*  const useGuilds = (limit) => {

  return useSWRImmutable<GuildBase[]>(`/v2/guilds?order=FEATURED&limit=${limit}`) // TODO lekérést  megnézni
} */

const Page = (): JSX.Element => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#37373a")
  const [gameInProgress, setGameInProgress] = useState<boolean>(false)

  const getRandomGameMode = (): GameMode =>
    possibleGameModes[Math.floor(Math.random() * possibleGameModes.length)]
  const possibleGameModes: GameMode[] = ["GuessTheGuild", "PairTheGuild"]
  const [gameMode, setGameMode] = useState<GameMode>(getRandomGameMode())

  // const limit = [100, 500, 1000]
  const [selectedLevel, setSelectedLevel] = useState<GameLevel>(GameLevel.Easy)

  const title: string = gameInProgress
    ? gameMode === "GuessTheGuild"
      ? "Guess the guild by the logo"
      : "Pair the logos to their guilds"
    : "Choose a difficulty level and press the button"

  const onSubmit = () => {
    setGameMode(getRandomGameMode())
  }
  const { data } = useSWRImmutable<GuildBase[]>(
    `/v2/guilds?order=FEATURED&limit=${selectedLevel}`
  )

  const onStartGame = () => {
    console.log("selectedLevel", selectedLevel)
    console.log("guilds", data)
    setGameInProgress(true)
  }

  /* 
  const changeSelectedLevel = (newSelectedLevel) => {
    // TODO useEffect?
    setSelectedLevel(newSelectedLevel)
  } */

  return (
    <>
      <Layout
        title="Guess the Guild"
        background={bgColor}
        backgroundProps={{
          opacity: 1,
        }}
        textColor="white"
        maxWidth="container.md"
      >
        <SelectGameLevel
          selected={selectedLevel}
          onSelect={setSelectedLevel}
        ></SelectGameLevel>
        <Card
          data-test="guess-the-guild"
          pos="relative"
          py="6"
          px={{ base: 5, md: 6 }}
        >
          <Text as="span" fontSize="lg" fontWeight="bold" textAlign="center">
            {title}
          </Text>
          {!gameInProgress && gameMode === "GuessTheGuild" ? (
            <GuessTheGuild guildData={data}></GuessTheGuild>
          ) : (
            <PairTheGuild guildData={data}></PairTheGuild>
          )}
          <Center mt="6">
            {gameInProgress ? (
              <Button colorScheme="green" onClick={onSubmit}>
                Submit
              </Button>
            ) : (
              <Button colorScheme="green" onClick={onStartGame}>
                Start game
              </Button>
            )}
          </Center>
        </Card>
      </Layout>
    </>
  )
}

export default Page
