import {
  Button,
  Card,
  Center,
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
import VerifiedIcon from "components/common/VerifiedIcon"
import useLocalStorage from "hooks/useLocalStorage"
import { Users } from "phosphor-react"
import { useMemo, useState } from "react"
import { GuildBase } from "types"
import pluralize from "utils/pluralize"

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

  const onSubmit = () => {}

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
          {guildLogos.map((guild) => (
            <GuildLogo key={guild.id} size="4rem" imageUrl={guild.imageUrl} />
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
            <GuildLogo size="4rem" imageUrl={guild.imageUrl} />
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
                {guild.tags?.includes("VERIFIED") && <VerifiedIcon size={5} />}
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
      {showResult && (
        <Button colorScheme="green" onClick={() => nextRound()}>
          Next Round
        </Button>
      )}
    </>
  )
}
export default PairTheGuild
