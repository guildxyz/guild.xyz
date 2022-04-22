import { Flex, SimpleGrid } from "@chakra-ui/react"
import Button from "components/common/Button"
import GuildCard from "components/index/GuildCard"
import { useRouter } from "next/router"
import { GuildBase } from "types"
import LandingWideSection from "./LandingWideSection"

type Props = {
  guilds: GuildBase[]
}

const ExploreTrendingGuilds = ({ guilds }: Props): JSX.Element => {
  const renderedGuilds = guilds?.slice(0, 12) || []

  const router = useRouter()
  const showExplorer = () =>
    router.push({ query: { ...router.query, view: "explorer" } }, undefined, {
      scroll: false,
      shallow: true,
    })

  return (
    <LandingWideSection
      title="Explore trending Guilds"
      position="relative"
      maxH="80vh"
      overflow="hidden"
    >
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
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
          onClick={showExplorer}
          colorScheme="DISCORD"
          mb={8}
          px={{ base: 4, "2xl": 6 }}
          h={{ base: 12, "2xl": 14 }}
          fontFamily="display"
          fontWeight="bold"
          letterSpacing="wide"
          lineHeight="base"
          pointerEvents="all"
        >
          See all the guilds
        </Button>
      </Flex>
    </LandingWideSection>
  )
}

export default ExploreTrendingGuilds
