import { Stack, Text } from "@chakra-ui/react"
import { kv } from "@vercel/kv"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ClientOnly from "components/common/ClientOnly"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import MysteryBoxCard from "components/leaderboard/MysteryBoxCard"
import PinLeaderboardUserCard, {
  PinLeaderboardUserCardSkeleton,
} from "components/leaderboard/PinLeaderboardUserCard"
import PinLeaderboardUsersPositionCard from "components/leaderboard/PinLeaderboardUsersPositionCard"
import useHasAlreadyClaimedMysteryBox from "components/leaderboard/hooks/useHasAlreadyClaimedMysteryBox"
import usePinLeaderboardUsersPosition from "components/leaderboard/hooks/usePinLeaderboardUsersPosition"
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import useNftBalance from "hooks/useNftBalance"
import useScrollEffect from "hooks/useScrollEffect"
import { GetStaticProps } from "next"
import { useEffect, useState } from "react"
import useSWRInfinite from "swr/infinite"
import { DetailedUserLeaderboardData } from "types"
import { useAccount } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import { MYSTERY_BOX_NFT } from "./api/leaderboard/mystery-box"

const MotionSection = motion(Section)

type Props = {
  leaderboard: DetailedUserLeaderboardData[]
}

const DESCRIPTION =
  "This board shows top Guild Pin collectors. The first leaderboard season was closed in July and top 100 collectors received a non-transferable Mystery Box NFT unlocking physical goodies. Keep your eyes open for new ones. Gotta catch 'em all!"
const PAGE_SIZE = 25
const MAX_SWR_INFINITE_SIZE = 4 // fetching at most MAX_SWR_INFINITE_SIZE * PAGE_SIZE entries
const SCROLL_PADDING = 40

const getKey = (pageIndex: number, previousPageData: any[]) => {
  if (previousPageData && !previousPageData.length) return null
  return `/api/leaderboard?offset=${Math.min(PAGE_SIZE * pageIndex, 75)}`
}

const Page = ({ leaderboard: initialData }: Props) => {
  const { isConnected } = useAccount()
  const { data: mysteryBoxBalance } = useNftBalance({
    nftAddress: MYSTERY_BOX_NFT.address,
    chainId: Chains[MYSTERY_BOX_NFT.chain],
  })
  const {
    data: { alreadyClaimed },
  } = useHasAlreadyClaimedMysteryBox()
  const [initialAlreadyClaimed, setInitialAlreadyClaimed] = useState<boolean>()
  const { data } = usePinLeaderboardUsersPosition()

  useEffect(() => {
    if (
      typeof alreadyClaimed === "undefined" ||
      typeof initialAlreadyClaimed !== "undefined"
    )
      return
    setInitialAlreadyClaimed(alreadyClaimed)
  }, [alreadyClaimed, initialAlreadyClaimed])

  const showMysteryBox = mysteryBoxBalance > 0 && !initialAlreadyClaimed

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
      backgroundOffset={showMysteryBox ? 70 : 46}
      maxWidth="container.md"
      description={<Text>{DESCRIPTION}</Text>}
    >
      <AnimateSharedLayout>
        <ClientOnly>
          <AnimatePresence>
            {showMysteryBox && (
              <CardMotionWrapper>
                <MysteryBoxCard />
              </CardMotionWrapper>
            )}
          </AnimatePresence>
        </ClientOnly>
        <Stack spacing={10}>
          <ClientOnly>
            <AnimatePresence>
              {isConnected && <PinLeaderboardUsersPositionCard />}
            </AnimatePresence>
          </ClientOnly>

          <MotionSection layout title={data ? "Leaderboard" : undefined}>
            <>
              {leaderboard
                ?.flat()
                .filter(Boolean)
                .map((userLeaderboardData, index) => (
                  <PinLeaderboardUserCard
                    key={index}
                    address={userLeaderboardData?.address}
                    score={userLeaderboardData?.score}
                    position={index + 1}
                    pinMetadataArray={
                      userLeaderboardData?.pins.map((p) => p.tokenUri) ?? []
                    }
                  />
                ))}
              {isLeaderboardValidating &&
                [...Array(25)].map((_, index) => (
                  <PinLeaderboardUserCardSkeleton key={index} />
                ))}
            </>
          </MotionSection>
        </Stack>
      </AnimateSharedLayout>
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
