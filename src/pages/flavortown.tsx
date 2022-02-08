import { Flex, Heading, HStack, Spinner, Text, useColorMode } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useUpvoty from "components/common/Layout/components/InfoMenu/hooks/useUpvoty"
import Flavortown from "components/common/Layout/Flavortown"
import Link from "components/common/Link"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import useUsersGuildsRolesIds from "components/index/hooks/useUsersGuildsRolesIds"
import { OrderOptions } from "components/index/OrderSelect"
import { useQueryState } from "hooks/useQueryState"
import useScrollEffect from "hooks/useScrollEffect"
import { GetStaticProps } from "next"
import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

const BATCH_SIZE = 24

type Props = {
  guilds: GuildBase[]
}

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const [search, setSearch] = useQueryState<string>("search", undefined)
  const [order, setOrder] = useQueryState<OrderOptions>("order", "members")

  const query = new URLSearchParams({ order, ...(search && { search }) }).toString()

  const [guilds, setGuilds] = useState(guildsInitial)
  const [renderedGuildsCount, setRenderedGuildsCount] = useState(BATCH_SIZE)

  useEffect(() => {
    setRenderedGuildsCount(BATCH_SIZE)
  }, [search])

  const guildsListEl = useRef(null)

  useScrollEffect(() => {
    if (
      !guildsListEl.current ||
      guildsListEl.current.getBoundingClientRect().bottom > window.innerHeight ||
      guilds?.length <= renderedGuildsCount
    )
      return

    setRenderedGuildsCount((prevValue) => prevValue + BATCH_SIZE)
  })

  const renderedGuilds = useMemo(
    () => guilds?.slice(0, renderedGuildsCount) || [],
    [guilds, renderedGuildsCount]
  )

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

  const { isRedirecting, upvotyAuthError } = useUpvoty()

  if (isRedirecting)
    return (
      <Flex alignItems="center" justifyContent="center" direction="column" h="100vh">
        <Heading mb={4} fontFamily="display">
          Guild - Upvoty authentication
        </Heading>
        {upvotyAuthError ? (
          <Text as="span" fontSize="lg">
            You are not a member of any guilds. Please <Link href="/">join one</Link>{" "}
            and you can vote on the roadmap!
          </Text>
        ) : (
          <HStack>
            <Spinner size="sm" />
            <Text as="span" fontSize="lg">
              Redirecting, please wait...
            </Text>
          </HStack>
        )}
      </Flex>
    )

  return (
    <>
      <LinkPreviewHead path="" />
      <Flavortown title="Flavor Yield"></Flavortown>
    </>
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
