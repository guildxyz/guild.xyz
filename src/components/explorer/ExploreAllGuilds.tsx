import {
  Box,
  Button,
  Center,
  Divider,
  GridItem,
  Icon,
  InputGroup,
  InputRightAddon,
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
import SearchBar from "components/explorer/SearchBar"
import { useQueryState } from "hooks/useQueryState"
import useScrollEffect from "hooks/useScrollEffect"
import { StarFour } from "phosphor-react"
import { forwardRef, useEffect } from "react"
import useSWRInfinite from "swr/infinite"
import { GuildBase } from "types"

type Props = {
  guildsInitial: GuildBase[]
}

export type OrderOptions = "featured" | "newest" | "verified"

const ExploreAllGuilds = forwardRef(({ guildsInitial }: Props, ref: any) => {
  const { account } = useWeb3React()
  const [search, setSearch] = useQueryState<string>("search", undefined)
  const prevSearch = usePrevious(search)
  const [order, setOrder] = useQueryState<OrderOptions>("order", "newest")

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
        <SimpleGrid
          templateColumns={{ base: "1fr", md: "4fr 2fr" }}
          gap={{ base: 2, md: 0 }}
          // needed so there's no gap on the right side of the page in mobile Safari
          overflow={"hidden"}
          // needed so the focus outline is not cut off because of the hidden overflow
          p={"1px"}
        >
          <GridItem>
            <SearchBar
              placeholder="Search guilds"
              {...{ search, setSearch }}
              borderRightRadius={0}
            />
          </GridItem>
          <GridItem>
            <InputGroup size="lg">
              <InputRightAddon
                bgColor={{ base: "transparent", md: "gray.700" }}
                borderColor={{ base: "transparent", md: "whiteAlpha.70" }}
                paddingLeft={{ base: 0, md: 4 }}
              >
                <Box display="flex" justifyContent="flex-end" gap={1}>
                  {["Featured", "Newest", "Verified"].map((option: string) => {
                    const optionAsOrder = option.toLowerCase() as OrderOptions

                    return (
                      <Button
                        key={option}
                        leftIcon={<Icon as={StarFour} />}
                        as="label"
                        boxShadow="none !important"
                        cursor="pointer"
                        borderRadius="lg"
                        alignSelf="center"
                        size="sm"
                        bgColor={
                          order === optionAsOrder ? "whiteAlpha.300" : "transparent"
                        }
                        onClick={() => setOrder(optionAsOrder)}
                      >
                        {option}
                      </Button>
                    )
                  })}
                </Box>
              </InputRightAddon>
            </InputGroup>
          </GridItem>
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
