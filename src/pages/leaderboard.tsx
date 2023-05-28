import { Stack } from "@chakra-ui/react"
import { kv } from "@vercel/kv"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import LeaderboardCard, {
  LeaderboardCardSkeleton,
} from "components/leaderboard/LeaderboardCard"
import { GetStaticProps } from "next"
import useSWRImmutable from "swr/immutable"
import { UserLeaderboardData } from "types"

type Props = {
  leaderboard: UserLeaderboardData[]
}

const Page = ({ leaderboard }: Props) => {
  // const bgColor = useColorModeValue("gray.800", "whiteAlpha.200")

  const { account } = useWeb3React()
  const { data, isLoading } = useSWRImmutable<{
    userLeaderboardData: UserLeaderboardData
    position: number
  }>(account ? `/api/leaderboard/${account}` : null)

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
            <LeaderboardCardSkeleton />
          ) : (
            <LeaderboardCard
              position={data.position}
              userLeaderboardData={data.userLeaderboardData}
            />
          ))}

        <Section title={account ? "Leaderboard" : undefined}>
          {leaderboard.map((userLeaderboardData, index) => (
            <LeaderboardCard
              key={index}
              userLeaderboardData={userLeaderboardData}
              position={index + 1}
            />
          ))}
        </Section>
      </Stack>
    </Layout>
  )
}

const getStaticProps: GetStaticProps = async () => {
  const leaderboardTopAddresses: string[] = await kv.zrange(
    "guildPinsLeaderboard",
    0,
    24,
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
