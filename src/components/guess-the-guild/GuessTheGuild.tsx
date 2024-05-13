import { Button, Card, Center, Text } from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import useLocalStorage from "hooks/useLocalStorage"
import { useMemo, useState } from "react"
import { GuildBase } from "types"

type Props = {
  guildData: GuildBase[]
  onLevelSelectDisable: (levelSelectDisable: boolean) => void
}

const GuessTheGuild = ({ guildData, onLevelSelectDisable }: Props): JSX.Element => {
  const [showResult, setShowResult] = useState<boolean>(false)
  const [correctAnswerId, setCorrectAnswerId] = useState<number>()
  const [wrongAnswerId, setWrongAnswerId] = useState<number>()
  const [correctGuildName, setCorrectGuildName] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [points, setPoints] = useLocalStorage("guess-the-guild-points", 0)

  const [randomGuild, setRandomGuild] = useState<GuildBase>(
    guildData[Math.floor(Math.random() * guildData.length)]
  )

  const possibleGuilds: GuildBase[] = useMemo(
    () =>
      [
        ...guildData
          .filter((guild) => guild.id !== randomGuild.id)
          .sort(() => Math.random() - Math.random())
          .slice(0, 3),
        randomGuild,
      ].sort(() => Math.random() - Math.random()),
    [guildData, randomGuild]
  )

  const onSubmit = (guildId: number) => {
    if (guildId === randomGuild.id) {
      setCorrectAnswerId(guildId)
      setCorrectGuildName(guildData.find((guild) => guild.id === guildId).name)
      setPoints(points + 1)
    } else {
      setCorrectAnswerId(randomGuild.id)
      setWrongAnswerId(guildId)
      setCorrectGuildName("???")
      setTitle(`Wrong answer! Your score: ${points}`)
      onLevelSelectDisable(false)
    }
    setShowResult(true)
  }

  const onStartNewGame = () => {
    setTitle(null)
    setRandomGuild(guildData[Math.floor(Math.random() * guildData.length)])
    setCorrectGuildName("???")
    setCorrectAnswerId(null)
    setWrongAnswerId(null)
    setShowResult(false)
    setPoints(0)
    onLevelSelectDisable(true)
  }

  const nextRound = () => {
    setTitle(null)
    setRandomGuild(guildData[Math.floor(Math.random() * guildData.length)])
    setCorrectGuildName("???")
    setWrongAnswerId(null)
    setShowResult(false)
  }

  return (
    <>
      <Text as="span" textAlign="center">
        Points: {points}
      </Text>
      <Center mt="6">
        <GuildLogo size="85px" imageUrl={randomGuild.imageUrl} />
      </Center>
      <Center mt="3" mb="6">
        <Text as="span" fontWeight="bold" textAlign="center">
          {correctGuildName}
        </Text>
      </Center>
      {possibleGuilds.map((guild) => (
        <Card
          key={guild.id}
          my="2"
          py="4"
          borderRadius="13px"
          border={
            [correctAnswerId, wrongAnswerId].includes(guild.id)
              ? guild.id === correctAnswerId
                ? "green 3px solid"
                : "red 3px solid"
              : "#37373a 3px solid"
          }
          cursor="pointer"
          onClick={() => {
            onSubmit(guild.id)
          }}
        >
          <Center>
            <Text fontWeight="bold">{guild.name}</Text>
          </Center>
        </Card>
      ))}
      <Text as="span" fontSize="lg" fontWeight="bold" textAlign="center" my="5">
        {title}
      </Text>
      {showResult &&
        (wrongAnswerId ? (
          <Button colorScheme="green" onClick={() => onStartNewGame()}>
            Start new game
          </Button>
        ) : (
          <Button colorScheme="green" onClick={() => nextRound()}>
            Next Round
          </Button>
        ))}
    </>
  )
}

export default GuessTheGuild
