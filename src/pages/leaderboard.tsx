import { Stack } from "@chakra-ui/react"
import { kv } from "@vercel/kv"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import LeaderboardUserCard, {
  LeaderboardUserCardSkeleton,
} from "components/leaderboard/LeaderboardUserCard"
import useScrollEffect from "hooks/useScrollEffect"
import { GetStaticProps } from "next"
import useSWRImmutable from "swr/immutable"
import useSWRInfinite from "swr/infinite"
import { UserLeaderboardData } from "types"

type Props = {
  leaderboard: UserLeaderboardData[]
}

const PAGE_SIZE = 25
const getKey = (pageIndex: number, previousPageData: any[]) => {
  if (previousPageData && !previousPageData.length) return null
  return `/api/leaderboard?offset=${Math.max(PAGE_SIZE * pageIndex - 1, 0)}`
}

const Page = ({ leaderboard: initialData }: Props) => {
  // const bgColor = useColorModeValue("gray.800", "whiteAlpha.200")

  const { account } = useWeb3React()
  const { data, isLoading } = useSWRImmutable<{
    userLeaderboardData: UserLeaderboardData
    position: number
  }>(account ? `/api/leaderboard/${account}` : null)

  const {
    isValidating: isLeaderboardValidating,
    setSize,
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
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
    )
      return

    setSize((prevSize) => prevSize + 1)
  }, [isLeaderboardValidating])

  return (
    <Layout
      title="Guild Pins leaderboard"
      ogDescription="See how many addresses satisfy requirements and make allowlists out of them"
      // background={bgColor}
      // textColor="white"
      backgroundOffset={46}
      maxWidth="container.md"
    >
      <Stack spacing={10}>
        {account &&
          (isLoading || !data ? (
            <LeaderboardUserCardSkeleton />
          ) : (
            <LeaderboardUserCard
              position={data.position}
              userLeaderboardData={data.userLeaderboardData}
            />
          ))}

        <Section title={account ? "Leaderboard" : undefined}>
          <>
            {leaderboard?.flat().map((userLeaderboardData, index) => (
              <LeaderboardUserCard
                key={index}
                userLeaderboardData={userLeaderboardData}
                position={index + 1}
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
  const leaderboard: UserLeaderboardData[] = await kv.mget(
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
