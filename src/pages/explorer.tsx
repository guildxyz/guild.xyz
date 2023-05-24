import {
  Center,
  Divider,
  GridItem,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  Text,
  useBreakpointValue,
  useColorModeValue,
  usePrevious,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { BATCH_SIZE } from "components/_app/ExplorerProvider"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import Section from "components/common/Section"
import ExplorerCardMotionWrapper from "components/explorer/ExplorerCardMotionWrapper"
import GuildCard from "components/explorer/GuildCard"
import GuildCardsGrid from "components/explorer/GuildCardsGrid"
import OrderSelect, { OrderOptions } from "components/explorer/OrderSelect"
import SearchBar from "components/explorer/SearchBar"
import YourGuilds from "components/explorer/YourGuilds"
import { useQueryState } from "hooks/useQueryState"
import useScrollEffect from "hooks/useScrollEffect"
import { GetStaticProps } from "next"
import { useEffect, useRef } from "react"
import useSWRInfinite from "swr/infinite"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

type Props = {
  guilds: GuildBase[]
}

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const { account } = useWeb3React()

  const [search, setSearch] = useQueryState<string>("search", undefined)
  const prevSearch = usePrevious(search)
  const [order, setOrder] = useQueryState<OrderOptions>("order", "members")

  const query = new URLSearchParams({ order, ...(search && { search }) }).toString()

  const guildsListEl = useRef(null)

  const {
    data: filteredGuilds,
    setSize,
    isValidating: isFilteredValidating,
  } = useSWRInfinite(
    (pageIndex, previousPageData) =>
      Array.isArray(previousPageData) && previousPageData.length === 0
        ? null
        : `/guild?${query}&limit=${BATCH_SIZE}&offset=${pageIndex * BATCH_SIZE}`,
    (url: string) =>
      fetcher(url).then((data) =>
        data.filter(
          (guild) =>
            (guild.platforms?.length > 0 && guild.memberCount > 0) ||
            guild.memberCount > 1
        )
      ),
    {
      fallbackData: guildsInitial,
      dedupingInterval: 60000, // one minute
      revalidateFirstPage: false,
    }
  )

  useEffect(() => {
    if (prevSearch === search || prevSearch === undefined) return
    setSize(0)
  }, [search, prevSearch])

  // TODO: we use this behaviour in multiple places now, should make a useScrollBatchedRendering hook
  useScrollEffect(() => {
    if (
      !guildsListEl.current ||
      guildsListEl.current.getBoundingClientRect().bottom > window.innerHeight ||
      isFilteredValidating
    )
      return

    setSize((prev) => prev + 1)
  }, [filteredGuilds, isFilteredValidating])

  const renderedGuilds = filteredGuilds?.flat()

  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#37373a") // dark color is from whiteAlpha.200, but without opacity so it can overlay the banner image
  const bgOpacity = useColorModeValue(0.06, 0.1)
  const bgLinearPercentage = useBreakpointValue({ base: "50%", sm: "55%" })

  return (
    <>
      <LinkPreviewHead path="" />
      <Layout
        title={"Guildhall"}
        ogDescription="Automated membership management for the platforms your community already uses."
        background={bgColor}
        backgroundProps={{
          _before: {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            bg: `linear-gradient(to top right, ${bgColor} ${bgLinearPercentage}, transparent), url('/banner.png ')`,
            bgSize: { base: "auto 100%", sm: "auto 115%" },
            bgRepeat: "no-repeat",
            bgPosition: "top 10px right 0px",
            opacity: bgOpacity,
          },
        }}
        backgroundOffset={account ? 100 : 90}
        textColor="white"
      >
        <YourGuilds guildsInitial={guildsInitial} />

        <Stack ref={guildsListEl} spacing={{ base: 8, md: 10 }}>
          {account && <Divider />}
          <Section
            title="Explore all guilds"
            titleRightElement={
              isFilteredValidating ? (
                <Spinner size="sm" />
              ) : (
                <Tag size="sm">{filteredGuilds.length}</Tag>
              )
            }
          >
            <SimpleGrid
              templateColumns={{ base: "auto 50px", md: "1fr 1fr 1fr" }}
              gap={{ base: 2, md: "6" }}
              pb={{ md: 2 }}
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

            {isFilteredValidating ? null : !renderedGuilds.length ? (
              !search?.length ? (
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

          <Center>{isFilteredValidating && <Spinner />}</Center>
        </Stack>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const guilds = await fetcher(`/guild?sort=members`)
    .then((list) => list)
    .catch((_) => [])

  return {
    props: { guilds },
    revalidate: 60,
  }
}

export default Page
