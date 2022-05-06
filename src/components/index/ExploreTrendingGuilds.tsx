import { Box, Flex, SimpleGrid, Spinner } from "@chakra-ui/react"
import LinkButton from "components/common/LinkButton"
import GuildCard from "components/explorer/GuildCard"
import useSWR from "swr"
import LandingWideSection from "./LandingWideSection"

const ExploreTrendingGuilds = (): JSX.Element => {
  const { data: guilds, isValidating } = useSWR("/guild", {
    refreshInterval: 0,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  const renderedGuilds = guilds?.slice(0, 12) || []

  return (
    <LandingWideSection title="Explore trending Guilds" position="relative">
      {!guilds?.length && isValidating ? (
        <Flex alignItems="center" justifyContent="center">
          <Spinner />
        </Flex>
      ) : (
        <>
          <Box h="70vh" overflow="hidden">
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3 }}
              spacing={{ base: 5, md: 6 }}
            >
              {renderedGuilds.map((guild) => (
                <GuildCard key={guild.urlName} guildData={guild} />
              ))}
            </SimpleGrid>
          </Box>

          <Flex
            alignItems="end"
            justifyContent="center"
            position="absolute"
            inset={-1}
            bgGradient="linear-gradient(to top, var(--chakra-colors-gray-800) 0%, var(--chakra-colors-gray-800) 20%, transparent)"
            zIndex="banner"
            pointerEvents="none"
          >
            <LinkButton
              href="/explorer"
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
            </LinkButton>
          </Flex>
        </>
      )}
    </LandingWideSection>
  )
}

export default ExploreTrendingGuilds
