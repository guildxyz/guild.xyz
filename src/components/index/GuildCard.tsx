import { Tag, TagLabel, TagLeftIcon, Text, useColorMode, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { Users } from 'phosphor-react'
import { Guild } from "temporaryData/guilds"

type Props = {
  guildData: Guild
}

const GuildCard = ({ guildData }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  return (
    <Link
      href={`/${guildData.urlName}`}
      _hover={{ textDecor: "none" }}
      borderRadius="2xl"
      w="full"
    >
      <Card
        role="group"
        position="relative"
        px={{ base: 5, sm: 7 }}
        py="7"
        w="full"
        bg={colorMode === "light" ? "white" : "gray.700"}
        _before={{
          content: `""`,
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          bg: "primary.300",
          opacity: 0,
          transition: "opacity 0.2s",
        }}
        _hover={{
          _before: {
            opacity: 0.1,
          },
        }}
        _active={{
          _before: {
            opacity: 0.17,
          },
        }}
      >
        <VStack spacing={4} alignItems="start">
          <Text fontFamily="display" fontSize="xl" fontWeight="bold" letterSpacing="wide">{guildData.name}</Text>
          <Tag>
          <TagLeftIcon as={Users} />
      <TagLabel>{guildData.members}</TagLabel>
            </Tag>
        </VStack>
      </Card>
    </Link>
  )
}

export default GuildCard
