import {
  Box,
  Center,
  Divider,
  HStack,
  Spinner,
  Stack,
  Text,
  VStack,
  useBreakpointValue,
  useColorModeValue,
  usePrevious,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { BATCH_SIZE } from "components/_app/ExplorerProvider"
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
import SearchBarFilters, { Filters } from "./SearchBarFilters"

type Props = {
  guildsInitial: GuildBase[]
}

const ExploreAllGuilds = forwardRef(({ guildsInitial }: Props, ref: any) => {
  const { account } = useWeb3React()
  const [search, setSearch] = useQueryState<string>("search", undefined)
  const prevSearch = usePrevious(search)
  const [order, setOrder] = useQueryState<Filters>("order", "NEWEST")
  const isMobile = useBreakpointValue({ base: true, md: false }, { fallback: "md" })
  const { ref: searchAreaRef, isStuck } = useIsStuck("-66px 0px 0px 0px")
  const bgColor = useColorModeValue("white", "gray.800")

  const query = new URLSearchParams({ order, ...(search && { search }) }).toString()

  const {
    data: filteredGuilds,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (pageIndex, previousPageData) =>
      Array.isArray(previousPageData) && previousPageData.length !== BATCH_SIZE
        ? null
        : `/guild?${query}&limit=${BATCH_SIZE}&offset=${pageIndex * BATCH_SIZE}`,
    {
      fallbackData: guildsInitial,
      dedupingInterval: 60000, // one minute
      revalidateFirstPage: false,
    }
  )
  const renderedGuilds = filteredGuilds?.flat()

  useEffect(() => {
    if (prevSearch === search || prevSearch === undefined) return
    setSize(1)
  }, [search, prevSearch])

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
      {account && <Divider />}
      <Section
        title="Explore all guilds"
        ref={ref}
        id="allGuilds"
        scrollMarginTop={20}
      >
        <Box
          ref={searchAreaRef}
          position="sticky"
          top={65}
          width="full"
          zIndex={isStuck ? "banner" : "auto"}
          _before={{
            content: `""`,
            position: "fixed",
            top: "65px",
            left: 0,
            width: "full",
            // button height + padding
            height: isStuck
              ? isMobile
                ? "calc(var(--chakra-space-12) + (5 * var(--chakra-space-3)))"
                : "calc(var(--chakra-space-11) + (2 * var(--chakra-space-3)))"
              : 0,
            bgColor: bgColor,
            boxShadow: "md",
            transition:
              "opacity 0.2s ease, visibility 0.1s ease, height 0.2s ease  ",
            visibility: isStuck ? "visible" : "hidden",
            opacity: isStuck ? 1 : 0,
          }}
        >
          <VStack
            align="flex-start"
            bg={bgColor}
            transition={"all 0.2s ease"}
            py={isStuck ? "10px" : 0}
            position="relative"
          >
            <SearchBar
              placeholder="Search guilds"
              {...{ search, setSearch }}
              rightAddon={
                isMobile ? null : (
                  <SearchBarFilters selected={order} onSelect={setOrder} />
                )
              }
            />

            {isMobile && (
              <HStack gap={1}>
                <SearchBarFilters
                  selected={order}
                  onSelect={setOrder}
                ></SearchBarFilters>
              </HStack>
            )}
          </VStack>
        </Box>
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
