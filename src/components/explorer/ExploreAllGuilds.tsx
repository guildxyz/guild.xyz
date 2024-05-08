import {
  Center,
  Divider,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  usePrevious,
  VStack,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import {
  TABS_HEIGHT,
  TABS_HEIGHT_SM,
  TABS_SM_BUTTONS_STYLES,
} from "components/[guild]/Tabs/Tabs"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import ClientOnly from "components/common/ClientOnly"
import Section from "components/common/Section"
import ExplorerCardMotionWrapper from "components/explorer/ExplorerCardMotionWrapper"
import GuildCard from "components/explorer/GuildCard"
import GuildCardsGrid from "components/explorer/GuildCardsGrid"
import SearchBar from "components/explorer/SearchBar"
import useIsStuck from "hooks/useIsStuck"
import { useQueryState } from "hooks/useQueryState"
import useScrollEffect from "hooks/useScrollEffect"
import { forwardRef, useEffect } from "react"
import useSWRInfinite from "swr/infinite"
import { GuildBase } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import SearchBarFilters, { Filters } from "./SearchBarFilters"

const BATCH_SIZE = 24

const useExploreGuilds = (query, guildsInitial) => {
  const fetcherWithSign = useFetcherWithSign()
  const { isSuperAdmin } = useUser()

  const options = {
    fallbackData: guildsInitial,
    dedupingInterval: 60000, // one minute
    revalidateFirstPage: false,
  }

  // sending authed request for superAdmins, so they can see unverified & hideFromExplorer guilds too
  return useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (Array.isArray(previousPageData) && previousPageData.length !== BATCH_SIZE)
        return null

      const url = `/v2/guilds?${query}&limit=${BATCH_SIZE}&offset=${
        pageIndex * BATCH_SIZE
      }`

      if (isSuperAdmin) return [url, { method: "GET", body: {} }]
      return url
    },
    isSuperAdmin ? fetcherWithSign : (options as any),
    isSuperAdmin ? options : null
  )
}

type Props = {
  guildsInitial: GuildBase[]
}

const ExploreAllGuilds = forwardRef(({ guildsInitial }: Props, ref: any) => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const [search, setSearch] = useQueryState<string>("search", undefined)
  const prevSearch = usePrevious(search)
  const [order, setOrder] = useQueryState<Filters>("order", "FEATURED")
  const isMobile = useBreakpointValue({ base: true, md: false }, { fallback: "md" })
  const { ref: searchAreaRef, isStuck } = useIsStuck()
  const searchAreaHeight = useBreakpointValue({
    base: "calc(var(--chakra-space-11) + (5 * var(--chakra-space-3)))",
    md: "calc(var(--chakra-space-12) + var(--chakra-space-3))",
  })
  const stuckTabsBg = useColorModeValue(
    "linear-gradient(white 0px, var(--chakra-colors-gray-50) 100%)",
    "linear-gradient(var(--chakra-colors-gray-800) 0px, #323237 100%)"
  )
  // needed so there's no transparent state in dark mode when the input is becoming stuck
  const searchBg = useColorModeValue("white", "gray.800")

  const onSetOrder = (value) => {
    setOrder(value)
    window.scrollTo({
      top: window.scrollY + ref.current.getBoundingClientRect().top - 20,
      behavior: "smooth",
    })
  }

  const query = new URLSearchParams({ order, ...(search && { search }) }).toString()

  const {
    data: filteredGuilds,
    setSize,
    isValidating,
  } = useExploreGuilds(query, guildsInitial)

  const renderedGuilds = filteredGuilds?.flat()

  useEffect(() => {
    if (prevSearch === search || prevSearch === undefined) return
    setSize(1)
  }, [search, prevSearch, setSize])

  // TODO: we use this behaviour in multiple places now, should make a useScrollBatchedRendering hook
  useScrollEffect(() => {
    if (
      !ref.current ||
      ref.current.getBoundingClientRect().bottom > window.innerHeight ||
      isValidating
    )
      return

    setSize((prev) => prev + 1)
  }, [filteredGuilds, isValidating])

  return (
    <Stack spacing={{ base: 8, md: 10 }}>
      <ClientOnly>{isWeb3Connected && <Divider />}</ClientOnly>
      <Section
        title="Explore verified guilds"
        ref={ref}
        id="allGuilds"
        scrollMarginTop={20}
      >
        <VStack
          ref={searchAreaRef}
          position="sticky"
          top={TABS_HEIGHT}
          transform={isStuck && "translateY(-12px)"}
          width="full"
          zIndex={"banner"}
          alignItems="flex-start"
          transition={"all 0.2s ease"}
          spacing={2.5}
        >
          {isStuck && (
            <style>{`#tabs::before {height: calc(${TABS_HEIGHT_SM} + ${searchAreaHeight}); background-image: ${stuckTabsBg}}
            ${TABS_SM_BUTTONS_STYLES}`}</style>
          )}
          <SearchBar
            placeholder="Search verified guilds"
            {...{ search, setSearch }}
            rightAddon={
              !isMobile && (
                <SearchBarFilters selected={order} onSelect={onSetOrder} />
              )
            }
            bg={searchBg}
            borderRadius={"xl"}
          />
          {isMobile && <SearchBarFilters selected={order} onSelect={onSetOrder} />}
        </VStack>
        {!renderedGuilds.length ? (
          isValidating ? null : !search?.length ? (
            <Text>
              Can't fetch guilds from the backend right now. Check back later!
            </Text>
          ) : (
            <Text>{`No results for ${search}`}</Text>
          )
        ) : (
          <GuildCardsGrid>
            {renderedGuilds.map((guild) => (
              <ExplorerCardMotionWrapper key={guild.urlName}>
                <GuildCard guildData={guild} />
              </ExplorerCardMotionWrapper>
            ))}
          </GuildCardsGrid>
        )}
      </Section>

      <Center>{isValidating && <Spinner />}</Center>
    </Stack>
  )
})

export default ExploreAllGuilds
