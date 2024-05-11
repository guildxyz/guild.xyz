import { Button, Center, Text, useColorModeValue } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import SelectGameLevel from "components/guess-the-guild/SelectGameLevel"
import { useState } from "react"
import useSWRImmutable from "swr/immutable"
import { GameLevel, GameMode } from "types"

const useGuilds = (limit) =>
  useSWRImmutable<any>(`/v2/guilds?order=FEATURED&limit=${limit}`)

const Page = (): JSX.Element => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#37373a")

  const getRandomGameMode = (): GameMode =>
    possibleGameModes[Math.floor(Math.random() * possibleGameModes.length)]
  const possibleGameModes: GameMode[] = ["GuessTheGuild", "PairTheGuild"]
  const [gameMode, setGameMode] = useState<GameMode>(getRandomGameMode())

  const limit = [100, 500, 1000]
  const [selectedLevel, setSelectedLevel] = useState<GameLevel>("Easy")

  const title: string =
    gameMode === "GuessTheGuild"
      ? "Guess the guild by the logo"
      : "Pair the logos to their guilds"

  const guilds = useGuilds(limit[0])

  const onSubmit = () => {
    setGameMode(getRandomGameMode())
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
          <Center>
            <Button colorScheme="green" onClick={onSubmit}>
              Submit
            </Button>
          </Center>
        </Card>
      </Layout>
    </>
  )
}

export default Page
