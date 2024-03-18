import { useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import ClientOnly from "components/common/ClientOnly"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import ExploreAllGuilds from "components/explorer/ExploreAllGuilds"
import ExplorerTabs from "components/explorer/ExplorerTabs"
import GoToCreateGuildButton from "components/explorer/GoToCreateGuildButton"
import YourGuilds, { useYourGuilds } from "components/explorer/YourGuilds"
import { atom, useAtom } from "jotai"
import { GetStaticProps } from "next"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

type Props = {
  guilds: GuildBase[]
}

const ExplorerScrollPositionAtom = atom(0)

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const yourGuildsRef = useRef(null)
  const allGuildsRef = useRef(null)

  const { data: usersGuilds } = useYourGuilds()

  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#37373a") // dark color is from whiteAlpha.200, but without opacity so it can overlay the banner image
  const bgOpacity = useColorModeValue(0.06, 0.1)
  const bgLinearPercentage = useBreakpointValue({ base: "50%", sm: "55%" })

  const router = useRouter()
  const [explorerScrollPosition, setExplorerScrollPositionAtom] = useAtom(
    ExplorerScrollPositionAtom
  )

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setExplorerScrollPositionAtom(window.scrollY)
    }

    const handleRouteChangeComplete = () => {
      /**
       * For some reason, without the delay, the scrolling is not executed. It might
       * be caused by the default 'scrollRestoration', which probably overwrites our
       * own scrolling, if not delayed.
       */
      setTimeout(
        () =>
          window.scrollTo({
            top: explorerScrollPosition,
            left: 0,
            behavior: "smooth",
          }),
        10
      )
    }

    router.events.on("routeChangeStart", handleRouteChangeStart)
    router.events.on("routeChangeComplete", handleRouteChangeComplete)

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart)
      router.events.off("routeChangeComplete", handleRouteChangeComplete)
    }
  }, [router, explorerScrollPosition])

  return (
    <>
      <LinkPreviewHead path="" />
      <Layout
        title={"Guildhall"}
        ogDescription="Automated membership management for the platforms your community already uses."
        background={bgColor}
        backgroundProps={{
          opacity: 1,
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
        backgroundOffset={usersGuilds?.length ? 135 : 120}
        textColor="white"
      >
        <ClientOnly>
          <ExplorerTabs
            {...{ yourGuildsRef, allGuildsRef }}
            rightElement={usersGuilds?.length && <GoToCreateGuildButton />}
          />
          <YourGuilds ref={yourGuildsRef} />
        </ClientOnly>

        <ExploreAllGuilds ref={allGuildsRef} {...{ guildsInitial }} />
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const guilds = await fetcher(`/v2/guilds?sort=members`).catch((_) => [])

  return {
    props: { guilds },
    revalidate: 300,
  }
}

export default Page
