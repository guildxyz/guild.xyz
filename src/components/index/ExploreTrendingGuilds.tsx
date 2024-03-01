import { Box, Flex, Spinner } from "@chakra-ui/react"
import { ArrowRight } from "@phosphor-icons/react"
import GuildCard from "components/explorer/GuildCard"
import GuildCardsGrid from "components/explorer/GuildCardsGrid"
import Link from "next/link"
import useSWR from "swr"
import LandingButton from "./LandingButton"
import LandingWideSection from "./LandingWideSection"

const ExploreTrendingGuilds = (): JSX.Element => {
  const { data: guilds, isValidating } = useSWR("/v2/guilds", {
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
          <Box maxH="70vh" overflow="hidden" position="relative">
            <GuildCardsGrid>
              {renderedGuilds.map((guild) => (
                <GuildCard key={guild.urlName} guildData={guild} />
              ))}
            </GuildCardsGrid>

            <Flex
              alignItems="end"
              justifyContent="center"
              position="absolute"
              inset={-1}
              bgGradient="linear-gradient(to top, var(--chakra-colors-gray-800), rgba(39, 39, 42, 0))"
              zIndex="banner"
              pointerEvents="none"
            />
          </Box>

          <Flex alignItems="center" justifyContent="center">
            <LandingButton
              as={Link}
              href="/explorer"
              w="max-content"
              position="relative"
              colorScheme="DISCORD"
              mb={8}
              rightIcon={<ArrowRight />}
            >
              See all the guilds
            </LandingButton>
          </Flex>
        </>
      )}
    </LandingWideSection>
  )
}

export default ExploreTrendingGuilds
