import {
  Center,
  Flex,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import useUpvoty from "components/common/Layout/components/NavMenu/hooks/useUpvoty"
import Link from "components/common/Link"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import CategorySection from "components/explorer/CategorySection"
import ExplorerCardMotionWrapper from "components/explorer/ExplorerCardMotionWrapper"
import GuildCard from "components/explorer/GuildCard"
import useMemberships from "components/explorer/hooks/useMemberships"
import OrderSelect, { OrderOptions } from "components/explorer/OrderSelect"
import SearchBar from "components/explorer/SearchBar"
import { useQueryState } from "hooks/useQueryState"
import useScrollEffect from "hooks/useScrollEffect"
import useSigningKeys from "hooks/useSigningKeys"
import { GetStaticProps } from "next"
import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

const BATCH_SIZE = 24

type Props = {
  guilds: GuildBase[]
}

const bufferToHex = (buffer: ArrayBuffer): string =>
  [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, "0")).join("")

const hexToBuffer = (hexString: string): ArrayBuffer =>
  new Uint8Array(
    hexString.match(/[0-9a-f]{2}/gi).map((hexPair) => parseInt(hexPair, 16))
  ).buffer

const strToBuffer = (string: string): ArrayBuffer =>
  new Uint8Array(string.match(/./gi).map((char) => char.charCodeAt(0))).buffer

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const { account } = useWeb3React()

  const [search, setSearch] = useQueryState<string>("search", undefined)
  const [order, setOrder] = useQueryState<OrderOptions>("order", "members")

  const query = new URLSearchParams({ order, ...(search && { search }) }).toString()

  const [guilds, setGuilds] = useState(guildsInitial)
  const [renderedGuildsCount, setRenderedGuildsCount] = useState(BATCH_SIZE)

  const { keyPair, pubKey, addKeyPair, ready } = useSigningKeys()

  useEffect(() => {
    if (!account || !ready) return

    if (!keyPair) {
      console.log("Generating keys...")
      addKeyPair.onSubmit()
      return
    }

    console.log(keyPair)
    console.log("pubKey export:", pubKey)

    console.log("Signing message...")
    window.crypto.subtle
      .sign(
        { name: "ECDSA", hash: "SHA-512" },
        keyPair.privateKey,
        strToBuffer("Hello")
      )
      .then((signatureBuffer) => {
        const signature = bufferToHex(signatureBuffer)
        console.log("signature:", signature)
        console.log("Verifying signature...")
        window.crypto.subtle
          .verify(
            { name: "ECDSA", hash: "SHA-512" },
            keyPair.publicKey,
            hexToBuffer(signature),
            strToBuffer("Hello")
          )
          .then((result) => {
            console.log("Result:", result)
          })
      })
  }, [keyPair, account])

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
  }, [guilds, renderedGuildsCount])

  const renderedGuilds = useMemo(
    () => guilds?.slice(0, renderedGuildsCount) || [],
    [guilds, renderedGuildsCount]
  )

  const { data: guildsData, isValidating: isLoading } = useSWR(`/guild?${query}`, {
    dedupingInterval: 60000, // one minute
  })
  useEffect(() => {
    if (guildsData)
      setGuilds(
        guildsData.filter(
          (guild) => guild.memberCount > 0 || guild.platforms?.length > 0
        )
      )
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

  const memberships = useMemberships()

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
      <Layout
        title="Guildhall"
        description="Automated membership management for the platforms your community already uses."
        showBackButton={false}
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

        <Stack ref={guildsListEl} spacing={12}>
          <CategorySection
            title={
              // usersGuilds will be empty in case of unmatched search query, memberships will be empty in case he's owner but not member of guilds
              usersGuilds?.length || memberships?.length
                ? "Your guilds"
                : "You're not part of any guilds yet"
            }
            titleRightElement={isUsersLoading && <Spinner size="sm" />}
            fallbackText={`No results for ${search}`}
          >
            {usersGuilds?.length || memberships?.length ? (
              (usersGuilds.length || !search) &&
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
              isLoading ? (
                <Spinner size="sm" />
              ) : (
                <Tag size="sm">{guilds.length}</Tag>
              )
            }
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

          <Center>{guilds?.length > renderedGuildsCount && <Spinner />}</Center>
        </Stack>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const guilds = await fetcher(`/guild?sort=members`)
    .then((list) =>
      list.filter((guild) => guild.memberCount > 0 || guild.platforms?.length > 0)
    )
    .catch((_) => [])

  return {
    props: { guilds },
    revalidate: 10,
  }
}

export default Page
