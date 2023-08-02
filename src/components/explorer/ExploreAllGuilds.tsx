import {
  Center,
  Divider,
  GridItem,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  usePrevious,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { BATCH_SIZE } from "components/_app/ExplorerProvider"
import Section from "components/common/Section"
import ExplorerCardMotionWrapper from "components/explorer/ExplorerCardMotionWrapper"
import GuildCard from "components/explorer/GuildCard"
import GuildCardsGrid from "components/explorer/GuildCardsGrid"
import OrderSelect, { OrderOptions } from "components/explorer/OrderSelect"
import SearchBar from "components/explorer/SearchBar"
import { useQueryState } from "hooks/useQueryState"
import useScrollEffect from "hooks/useScrollEffect"
import { forwardRef, useEffect } from "react"
import useSWRInfinite from "swr/infinite"
import { GuildBase } from "types"

type Props = {
  guildsInitial: GuildBase[]
}

const ExploreAllGuilds = forwardRef(({ guildsInitial }: Props, ref: any) => {
  const { account } = useWeb3React()
  const [search, setSearch] = useQueryState<string>("search", undefined)
  const prevSearch = usePrevious(search)
  const [order, setOrder] = useQueryState<OrderOptions>("order", "members")

  const query = new URLSearchParams({ order, ...(search && { search }) }).toString()

  const {
    data: filteredGuilds,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (pageIndex, previousPageData) =>
      Array.isArray(previousPageData) && previousPageData.length !== BATCH_SIZE
        ? null
        : `/v2/guilds?${query}&limit=${BATCH_SIZE}&offset=${pageIndex * BATCH_SIZE}`,
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
        <SimpleGrid
          templateColumns={{ base: "auto 50px", md: "1fr 1fr 1fr" }}
          gap={{ base: 2, md: "6" }}
          pb={{ md: 1.5 }}
          // needed so there's no gap on the right side of the page in mobile Safari
          overflow={"hidden"}
          // needed so the focus outline is not cut off because of the hidden overflow
          p={"1px"}
        >
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <SearchBar placeholder="Search guilds" {...{ search, setSearch }} />
          </GridItem>
          <OrderSelect {...{ order, setOrder }} />
        </SimpleGrid>

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
