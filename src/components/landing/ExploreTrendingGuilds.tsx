import { Button, Flex, Heading, SimpleGrid, Stack } from "@chakra-ui/react"
import GuildCard from "components/index/GuildCard"
import { GuildBase } from "types"

type Props = {
  guilds: GuildBase[]
}

const ExploreTrendingGuilds = ({ guilds }: Props): JSX.Element => {
  // Temp
  const renderedGuilds = guilds?.slice(0, 12) || []

  return (
    <Stack
      position="relative"
      mb={{ base: 16, md: 28 }}
      maxH="80vh"
      overflow="hidden"
      spacing={16}
    >
      <Heading as="h3" fontFamily="display" fontSize="4xl" textAlign="center">
        Explore trending Guilds
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
        {renderedGuilds.map((guild) => (
          <GuildCard key={guild.urlName} guildData={guild} />
        ))}
      </SimpleGrid>

      <Flex
        alignItems="end"
        justifyContent="center"
        position="absolute"
        left={0}
        bottom={0}
        w="full"
        h="full"
        bgGradient="linear-gradient(to top, var(--chakra-colors-gray-800) 0%, var(--chakra-colors-gray-800) 20%, transparent)"
        zIndex="banner"
        pointerEvents="none"
      >
        <Button
          colorScheme="solid-gray"
          px={{ base: 4, "2xl": 6 }}
          h={{ base: 12, "2xl": 14 }}
          fontFamily="display"
          fontWeight="bold"
          letterSpacing="wide"
          lineHeight="base"
          pointerEvents="all"
        >
          See more
        </Button>
      </Flex>
    </Stack>
  )
}

export default ExploreTrendingGuilds
