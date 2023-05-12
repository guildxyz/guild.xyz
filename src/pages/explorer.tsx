import {
  Box,
  Center,
  DarkMode,
  Divider,
  GridItem,
  HStack,
  Img,
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
import { BATCH_SIZE, useExplorer } from "components/_app/ExplorerProvider"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import LinkButton from "components/common/LinkButton"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import Section from "components/common/Section"
import CategorySection from "components/explorer/CategorySection"
import ExplorerCardMotionWrapper from "components/explorer/ExplorerCardMotionWrapper"
import GuildCard from "components/explorer/GuildCard"
import OrderSelect, { OrderOptions } from "components/explorer/OrderSelect"
import SearchBar from "components/explorer/SearchBar"
import useMemberships, {
  Memberships,
} from "components/explorer/hooks/useMemberships"
import { useQueryState } from "hooks/useQueryState"
import useScrollEffect from "hooks/useScrollEffect"
import { GetStaticProps } from "next"
import { Plus, Wallet } from "phosphor-react"
import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

type Props = {
  guilds: GuildBase[]
}

const getUsersGuilds = (memberships: Memberships, guildsData: any) => {
  if (!memberships?.length || !guildsData?.length) return []
  const usersGuildsIds = memberships.map((membership) => membership.guildId)
  const newUsersGuilds = guildsData.filter((guild) =>
    usersGuildsIds.includes(guild.id)
  )
  return newUsersGuilds
}

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const { openWalletSelectorModal } = useWeb3ConnectionManager()

  const [search, setSearch] = useQueryState<string>("search", undefined)
  const prevSearch = usePrevious(search)
  const [order, setOrder] = useQueryState<OrderOptions>("order", "members")
  const { renderedGuildsCount, setRenderedGuildsCount } = useExplorer()

  const query = new URLSearchParams({ order, ...(search && { search }) }).toString()

  useEffect(() => {
    if (prevSearch === search || prevSearch === undefined) return
    setRenderedGuildsCount(BATCH_SIZE)
  }, [search, prevSearch])

  const guildsListEl = useRef(null)

  const {
    data: [allGuilds, filteredGuilds],
    isValidating: isLoading,
  } = useSWR(
    `/guild?${query}`,
    (url: string) =>
      fetcher(url).then((data) => [
        data,
        data.filter(
          (guild) =>
            (guild.platforms?.length > 0 && guild.memberCount > 0) ||
            guild.memberCount > 1
        ),
      ]),
    {
      fallbackData: [guildsInitial, guildsInitial],
      dedupingInterval: 60000, // one minute
    }
  )

  // TODO: we use this behaviour in multiple places now, should make a useScrollBatchedRendering hook
  useScrollEffect(() => {
    if (
      !guildsListEl.current ||
      guildsListEl.current.getBoundingClientRect().bottom > window.innerHeight ||
      filteredGuilds?.length <= renderedGuildsCount
    )
      return

    setRenderedGuildsCount((prevValue) => prevValue + BATCH_SIZE)
  }, [filteredGuilds, renderedGuildsCount])

  const renderedGuilds = useMemo(
    () => filteredGuilds?.slice(0, renderedGuildsCount) || [],
    [filteredGuilds, renderedGuildsCount]
  )

  const { memberships } = useMemberships()
  const [usersGuilds, setUsersGuilds] = useState<GuildBase[]>(
    getUsersGuilds(memberships, allGuilds)
  )

  useEffect(() => {
    setUsersGuilds(getUsersGuilds(memberships, allGuilds))
  }, [memberships, allGuilds])

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
            bgSize: { base: "auto 100%", sm: "auto 125%" },
            bgRepeat: "no-repeat",
            bgPosition: "top 10px right 10px",
            opacity: bgOpacity,
          },
        }}
        backgroundOffset={account ? 100 : 90}
        textColor="white"
      >
        <Section
          title="Your guilds"
          titleRightElement={
            (usersGuilds?.length || memberships?.length) && (
              <Box my="-2 !important" ml="auto !important">
                <DarkMode>
                  <LinkButton
                    leftIcon={<Plus />}
                    size="sm"
                    variant="ghost"
                    href="/create-guild"
                  >
                    Create guild
                  </LinkButton>
                </DarkMode>
              </Box>
            )
          }
          mb={{ base: 8, md: 12, lg: 14 }}
          sx={{ ".chakra-heading": { color: "white" } }}
        >
          {!account ? (
            <Card p="6">
              <HStack justifyContent="space-between">
                <HStack spacing="4">
                  <Img src="landing/robot.svg" boxSize={"2em"} />
                  <Text fontWeight={"semibold"}>
                    Connect your wallet to view your guilds / create new ones
                  </Text>
                </HStack>
                <Button
                  colorScheme="indigo"
                  leftIcon={<Wallet />}
                  onClick={openWalletSelectorModal}
                >
                  Connect
                </Button>
              </HStack>
            </Card>
          ) : usersGuilds?.length || memberships?.length ? (
            <CategorySection
              // titleRightElement={
              //   account && (!memberships || isLoading) && <Spinner size="sm" />
              // }
              fallbackText={`No results for ${search}`}
            >
              {(usersGuilds.length || !search) &&
                usersGuilds.map((guild) => (
                  <ExplorerCardMotionWrapper key={guild.urlName}>
                    <GuildCard guildData={guild} />
                  </ExplorerCardMotionWrapper>
                ))}
            </CategorySection>
          ) : (
            <Card p="6">
              <Stack
                direction={{ base: "column", md: "row" }}
                justifyContent="space-between"
                spacing="6"
              >
                <HStack>
                  <Text fontWeight={"semibold"}>
                    You're not a member of any guilds yet. Explore and join some
                    below, or create your own!
                  </Text>
                </HStack>
                <LinkButton
                  leftIcon={<Plus />}
                  href="/create-guild"
                  colorScheme="gray"
                >
                  Create guild
                </LinkButton>
              </Stack>
            </Card>
          )}
        </Section>

        <Stack ref={guildsListEl} spacing={{ base: 8, md: 10 }}>
          {memberships?.length && <Divider />}
          <Section
            title="Explore all guilds"
            titleRightElement={
              isLoading ? (
                <Spinner size="sm" />
              ) : (
                <Tag size="sm">{filteredGuilds.length}</Tag>
              )
            }
          >
            <SimpleGrid
              templateColumns={{ base: "auto 50px", md: "1fr 1fr 1fr" }}
              gap={{ base: 2, md: "6" }}
              pb="2"
            >
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <SearchBar placeholder="Search guilds" {...{ search, setSearch }} />
              </GridItem>
              <OrderSelect {...{ isLoading, order, setOrder }} />
            </SimpleGrid>

            <CategorySection
              fallbackText={
                search?.length
                  ? `No results for ${search}`
                  : "Can't fetch guilds from the backend right now. Check back later!"
              }
            >
              {renderedGuilds.length &&
                renderedGuilds.map((guild) => (
                  <ExplorerCardMotionWrapper key={guild.urlName}>
                    <GuildCard guildData={guild} />
                  </ExplorerCardMotionWrapper>
                ))}
            </CategorySection>
          </Section>

          <Center>
            {filteredGuilds?.length > renderedGuildsCount && <Spinner />}
          </Center>
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
