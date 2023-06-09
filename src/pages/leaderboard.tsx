import { Stack, Text } from "@chakra-ui/react"
import { kv } from "@vercel/kv"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import LeaderboardUserCard, {
  LeaderboardUserCardSkeleton,
} from "components/leaderboard/LeaderboardUserCard"
import useScrollEffect from "hooks/useScrollEffect"
import useUsersGuildPins from "hooks/useUsersGuildPins"
import { GetStaticProps } from "next"
import useSWRImmutable from "swr/immutable"
import useSWRInfinite from "swr/infinite"
import { DetailedUserLeaderboardData } from "types"

type Props = {
  leaderboard: DetailedUserLeaderboardData[]
}

const DESCRIPTION =
  "This board shows top Guild Pin collectors. Keep your eyes open for new ones launching every week. Gotta catch 'em all! There is something cool being prepared for the top collectors. (Disclaimer: It won't be a token airdrop.)"
const PAGE_SIZE = 25
const MAX_SWR_INFINITE_SIZE = 4 // fetching at most MAX_SWR_INFINITE_SIZE * PAGE_SIZE entries
const SCROLL_PADDING = 40

const getKey = (pageIndex: number, previousPageData: any[]) => {
  if (previousPageData && !previousPageData.length) return null
  return `/api/leaderboard?offset=${Math.min(PAGE_SIZE * pageIndex, 75)}`
}

const Page = ({ leaderboard: initialData }: Props) => {
  const { account } = useWeb3React()
  const { data, isLoading } = useSWRImmutable<{
    score: number
    position: number
  }>(account ? `/api/leaderboard/${account}` : null)

  const shouldFetchUsersGuildPins = account && data
  const { data: usersGuildPins } = useUsersGuildPins(!shouldFetchUsersGuildPins)

  const {
    isValidating: isLeaderboardValidating,
    setSize,
    size,
    data: leaderboard,
  } = useSWRInfinite(getKey, {
    fallbackData: [initialData],
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateFirstPage: false,
  })

  useScrollEffect(() => {
    if (
      isLeaderboardValidating ||
      window.innerHeight + document.documentElement.scrollTop <
        document.documentElement.offsetHeight - SCROLL_PADDING ||
      size === MAX_SWR_INFINITE_SIZE
    )
      return

    setSize((prevSize) => prevSize + 1)
  }, [isLeaderboardValidating])

  return (
    <Layout
      title="Guild Pins leaderboard"
      ogDescription={DESCRIPTION}
      background="gray.800"
      backgroundProps={{
        opacity: 1,
        _before: {
          content: "''",
          position: "absolute",
          inset: 0,
          bgImage:
            "linear-gradient(to bottom, transparent, var(--chakra-colors-gray-800)), url('/landing/bg.svg')",
          bgPosition: "center 0.25rem",
          opacity: 0.05,
        },
      }}
      textColor="white"
      backgroundOffset={46}
      maxWidth="container.md"
      description={<Text>{DESCRIPTION}</Text>}
    >
      <Stack spacing={10}>
        {account &&
          (isLoading ? (
            <LeaderboardUserCardSkeleton />
          ) : data ? (
            <LeaderboardUserCard
              address={account}
              score={data.score}
              position={data.position}
              pinMetadataArray={usersGuildPins}
            />
          ) : null)}

        <Section title={account ? "Leaderboard" : undefined}>
          <>
            {leaderboard?.flat().map((userLeaderboardData, index) => (
              <LeaderboardUserCard
                key={index}
                address={userLeaderboardData.address}
                score={userLeaderboardData.score}
                position={index + 1}
                pinMetadataArray={userLeaderboardData.pins.map((p) => p.tokenUri)}
              />
            ))}
            {isLeaderboardValidating &&
              [...Array(25)].map((_, index) => (
                <LeaderboardUserCardSkeleton key={index} />
              ))}
          </>
        </Section>
      </Stack>
    </Layout>
  )
}

const getStaticProps: GetStaticProps = async () => {
  const leaderboardTopAddresses: string[] = await kv.zrange(
    "guildPinsLeaderboard",
    0,
    PAGE_SIZE - 1,
    {
      rev: true,
    }
  )
  const leaderboard: DetailedUserLeaderboardData[] = await kv.mget(
    ...leaderboardTopAddresses.map((address) => `guildPins:${address}`)
  )

  return {
    props: {
      leaderboard,
    },
  }
}

export default Page
export { getStaticProps }
