import {
  Button,
  Card,
  Center,
  Circle,
  HStack,
  SimpleGrid,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import useLocalStorage from "hooks/useLocalStorage"
import { Users } from "phosphor-react"
import { useMemo, useState } from "react"
import { GuildBase } from "types"
import pluralize from "utils/pluralize"

type GuildIdCompare = {
  selectedGuildId?: number
  dragabbleGuildId: number
  dragabbleGuildImageUrl: string
}

type Props = {
  guildData: GuildBase[]
}

const PairTheGuild = ({ guildData }: Props): JSX.Element => {
  const [showResult, setShowResult] = useState<boolean>(false)
  const [title, setTitle] = useState<string>()
  const [points, setPoints] = useLocalStorage("guess-the-guild-points", 0)

  const guildLogos: GuildBase[] = useMemo(
    () =>
      [...guildData.sort(() => Math.random() - Math.random()).slice(0, 4)].sort(
        () => Math.random() - Math.random()
      ),
    [guildData]
  )

  const guildDetails: GuildBase[] = useMemo(
    () => [...guildLogos.sort(() => Math.random() - Math.random())],
    [guildLogos]
  )
  const [draggedGuilds, setDraggedGuilds] = useState<GuildIdCompare[]>([])
  const [tempDraggedGuild, setTempDraggedGuild] = useState<GuildIdCompare>()

  const onSubmit = () => {}
  const onClear = () => {
    setDraggedGuilds([])
  }

  const handleDrag = (guild) => {
    setTempDraggedGuild({
      dragabbleGuildId: guild.id,
      dragabbleGuildImageUrl: guild.imageUrl,
    })
    console.log("drag guild", guild)
    console.log("drag draggedLogos", draggedGuilds)
  }

  const handleOnDrop = (guildId) => {
    console.log("dropdropdropguildId", guildId)
    console.log("dropdropdropdrop draggedLogos", draggedGuilds)

    if (draggedGuilds.some((guild) => guild.selectedGuildId === guildId)) {
      console.log("edit")
    } else {
      setDraggedGuilds([
        ...draggedGuilds,
        { ...tempDraggedGuild, selectedGuildId: guildId },
      ])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const onStartNewGame = () => {
    setTitle(null)

    setShowResult(false)
    setPoints(0)
  }

  const nextRound = () => {
    setTitle(null)
    setShowResult(false)
  }

  return (
    <>
      <Text as="span" textAlign="center">
        Points: {points}
      </Text>
      <Center>
        <HStack position="relative" px={{ base: 5, sm: 6 }} my="6" gap="6">
          {guildLogos
            .filter(
              (guild) =>
                !draggedGuilds.some(
                  (draggedGuild) => draggedGuild.dragabbleGuildId === guild.id
                )
            )
            .map((guild) => (
              <GuildLogo
                draggable
                onDragStart={(e) => handleDrag(guild)}
                key={guild.id}
                size="4rem"
                imageUrl={guild.imageUrl}
              />
            ))}
        </HStack>
      </Center>

      {guildDetails.map((guild) => (
        <Card
          key={guild.id}
          my="2"
          p="4"
          borderRadius="13px"
          /* border={
            [correctAnswerId, wrongAnswerId].includes(guild.id)
              ? guild.id === correctAnswerId
                ? "green 3px solid"
                : "red 3px solid"
              : "#37373a 3px solid"
          } */
        >
          <SimpleGrid
            templateColumns="4rem calc(100% - 5rem)"
            gap={4}
            alignItems="center"
          >
            {draggedGuilds?.find((logo) => logo.selectedGuildId === guild.id) ? (
              <GuildLogo
                size="4rem"
                imageUrl={
                  draggedGuilds?.find((logo) => logo.selectedGuildId === guild.id)
                    .dragabbleGuildImageUrl
                }
              />
            ) : (
              <Circle
                borderWidth={2}
                borderStyle="dashed"
                size="4rem"
                onDrop={() => handleOnDrop(guild.id)}
                onDragOver={(e) => handleDragOver(e)}
              ></Circle>
            )}

            <VStack
              spacing={2}
              alignItems="start"
              w="full"
              maxW="full"
              mb="0.5"
              mt="-1"
            >
              <HStack spacing={1}>
                <Text
                  as="span"
                  fontFamily="display"
                  fontSize="lg"
                  fontWeight="bold"
                  letterSpacing="wide"
                  maxW="full"
                  noOfLines={1}
                  wordBreak="break-all"
                >
                  {guild.name}
                </Text>
              </HStack>

              <Wrap zIndex="1">
                <Tag as="li">
                  <TagLeftIcon as={Users} />
                  <TagLabel>
                    {new Intl.NumberFormat("en", { notation: "compact" }).format(
                      guild.memberCount ?? 0
                    )}
                  </TagLabel>
                </Tag>
                <Tag as="li">
                  <TagLabel>{pluralize(guild.rolesCount ?? 0, "role")}</TagLabel>
                </Tag>
              </Wrap>
            </VStack>
          </SimpleGrid>
        </Card>
      ))}

      <Text as="span" fontSize="lg" fontWeight="bold" textAlign="center" my="5">
        {title}
      </Text>
      <HStack justifyContent="end">
        <Button
          colorScheme="green"
          onClick={onSubmit}
          isDisabled={draggedGuilds.length !== 4}
        >
          Submit
        </Button>
        <Button onClick={onClear} isDisabled={draggedGuilds.length < 1}>
          Clear
        </Button>
      </HStack>
    </>
  )
}
export default PairTheGuild
