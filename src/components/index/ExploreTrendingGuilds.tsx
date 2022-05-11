import { Box, Flex, SimpleGrid, Spinner } from "@chakra-ui/react"
import GuildCard from "components/explorer/GuildCard"
import Link from "next/link"
import { ArrowRight } from "phosphor-react"
import useSWR from "swr"
import LandingButton from "./LandingButton"
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
    <LandingWideSection
      title="Explore trending Guilds"
      position="relative"
      pt="6"
      mb="-8"
    >
      {!guilds?.length && isValidating ? (
        <Flex alignItems="center" justifyContent="center">
          <Spinner />
        </Flex>
      ) : (
        <>
          <Box h="70vh" overflow="hidden">
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
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
            <Link passHref href="/explorer">
              <LandingButton
                as="a"
                colorScheme="DISCORD"
                mb={8}
                pointerEvents="all"
                rightIcon={<ArrowRight />}
              >
                See all the guilds
              </LandingButton>
            </Link>
          </Flex>
        </>
      )}
    </LandingWideSection>
  )
}

export default ExploreTrendingGuilds
