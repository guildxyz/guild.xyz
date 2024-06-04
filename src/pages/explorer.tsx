import { useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import ClientOnly from "components/common/ClientOnly"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import ExploreAllGuilds from "components/explorer/ExploreAllGuilds"
import ExplorerTabs from "components/explorer/ExplorerTabs"
import GoToCreateGuildButton from "components/explorer/GoToCreateGuildButton"
import YourGuilds, { useYourGuilds } from "components/explorer/YourGuilds"
import useScrollRestoration from "components/explorer/hooks/useScrollRestoration"
import { atom, useAtom } from "jotai"
import { GetStaticProps } from "next"
import { useRef } from "react"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

type Props = {
  guilds: GuildBase[]
}

export const explorerScrollRestorationAtom = atom(true)

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const yourGuildsRef = useRef(null)
  const allGuildsRef = useRef(null)

  const { data: usersGuilds } = useYourGuilds()

  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#37373a") // dark color is from whiteAlpha.200, but without opacity so it can overlay the banner image
  const bgOpacity = useColorModeValue(0.06, 0.1)
  const bgLinearPercentage = useBreakpointValue({ base: "50%", sm: "55%" })
  const [shouldRestoreScroll, setShouldRestoreScroll] = useAtom(
    explorerScrollRestorationAtom
  )

  useScrollRestoration({
    active: shouldRestoreScroll,
    onRestore: () => setShouldRestoreScroll(true),
  })

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
