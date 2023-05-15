import { Box, Flex, Spinner } from "@chakra-ui/react"
import GuildCard from "components/explorer/GuildCard"
import GuildCardsGrid from "components/explorer/GuildCardsGrid"
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
            <Link passHref href="/explorer">
              <LandingButton
                as="a"
                w="max-content"
                position="relative"
                colorScheme="DISCORD"
                mb={8}
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
