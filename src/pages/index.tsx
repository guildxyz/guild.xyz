import {
  GridItem,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  useColorMode,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import CategorySection from "components/index/CategorySection"
import ExplorerCardMotionWrapper from "components/index/ExplorerCardMotionWrapper"
import GuildCard from "components/index/GuildCard"
import useUsersGuildsRolesIds from "components/index/hooks/useUsersGuildsRolesIds"
import OrderSelect, { Options } from "components/index/OrderSelect"
import SearchBar from "components/index/SearchBar"
import { useQueryState } from "hooks/useQueryState"
import { GetStaticProps } from "next"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

type Props = {
  guilds: GuildBase[]
}

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const [search, setSearch] = useQueryState<string>("search", undefined)
  const [order, setOrder] = useQueryState<Options>("order", "members")

  const query = new URLSearchParams({ order, ...(search && { search }) }).toString()

  const [guilds, setGuilds] = useState(guildsInitial)
  const { data: guildsData, isValidating: isLoading } = useSWR(`/guild?${query}`, {
    dedupingInterval: 60000, // one minute
  })
  useEffect(() => {
    if (guildsData) setGuilds(guildsData)
  }, [guildsData])

  const [usersGuilds, setUsersGuilds] = useState<GuildBase[]>([])
  const { data: usersGuildsData, isValidating: isUsersLoading } = useSWR(
    account ? `/guild/address/${account}?${query}` : null,
    {
      dedupingInterval: 60000, // one minute
    }
  )
  useEffect(() => {
    if (usersGuildsData) setUsersGuilds(usersGuildsData)
  }, [usersGuildsData])

  const { usersGuildsIds } = useUsersGuildsRolesIds()

  // Setting up the dark mode, because this is a "static" page
  const { setColorMode } = useColorMode()

  useEffect(() => {
    setColorMode("dark")
  }, [])

  return (
    <Layout
      title="Guild"
      description="A place for Web3 guilds"
      imageUrl="/guildLogos/logo.svg"
      imageBg="transparent"
    >
      <SimpleGrid
        templateColumns={{ base: "auto 50px", md: "1fr 1fr 1fr" }}
        gap={{ base: 2, md: "6" }}
        mb={16}
      >
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <SearchBar placeholder="Search guilds" {...{ search, setSearch }} />
        </GridItem>
        <OrderSelect {...{ isLoading, order, setOrder }} />
      </SimpleGrid>

      <Stack spacing={12}>
        <CategorySection
          title={
            usersGuildsIds?.length
              ? "Your guilds"
              : "You're not part of any guilds yet"
          }
          titleRightElement={isUsersLoading && <Spinner size="sm" />}
          fallbackText={`No results for ${search}`}
        >
          {usersGuildsIds?.length ? (
            usersGuilds.length &&
            usersGuilds
              .map((guild) => (
                <ExplorerCardMotionWrapper key={guild.urlName}>
                  <GuildCard guildData={guild} />
                </ExplorerCardMotionWrapper>
              ))
              .concat(
                <ExplorerCardMotionWrapper key="create-guild">
                  <AddCard text="Create guild" link="/create-guild" />
                </ExplorerCardMotionWrapper>
              )
          ) : (
            <ExplorerCardMotionWrapper key="create-guild">
              <AddCard text="Create guild" link="/create-guild" />
            </ExplorerCardMotionWrapper>
          )}
        </CategorySection>
        <CategorySection
          title="All guilds"
          titleRightElement={
            isLoading ? <Spinner size="sm" /> : <Tag size="sm">{guilds.length}</Tag>
          }
          fallbackText={
            search?.length
              ? `No results for ${search}`
              : "Can't fetch guilds from the backend right now. Check back later!"
          }
        >
          {guilds.length &&
            guilds.map((guild) => (
              <ExplorerCardMotionWrapper key={guild.urlName}>
                <GuildCard guildData={guild} />
              </ExplorerCardMotionWrapper>
            ))}
        </CategorySection>
      </Stack>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const guilds = await fetcher(`/guild?sort=members`).catch((_) => [])

  return {
    props: { guilds },
    revalidate: 10,
  }
}

export default Page
