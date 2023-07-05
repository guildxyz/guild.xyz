import { useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import ExploreAllGuilds from "components/explorer/ExploreAllGuilds"
import ExplorerTabs from "components/explorer/ExplorerTabs"
import GoToCreateGuildButton from "components/explorer/GoToCreateGuildButton"
import YourGuilds from "components/explorer/YourGuilds"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { GetStaticProps } from "next"
import { useRef } from "react"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

type Props = {
  guilds: GuildBase[]
}

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const yourGuildsRef = useRef(null)
  const allGuildsRef = useRef(null)

  // ? is included, so the request hits v2Replacer in fetcher
  const { data: usersGuilds } = useSWRWithOptionalAuth(`/guild?`)

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
            bgSize: { base: "auto 100%", sm: "auto 115%" },
            bgRepeat: "no-repeat",
            bgPosition: "top 10px right 0px",
            opacity: bgOpacity,
          },
        }}
        backgroundOffset={usersGuilds?.length ? 135 : 120}
        textColor="white"
      >
        <ExplorerTabs
          {...{ yourGuildsRef, allGuildsRef }}
          rightElement={usersGuilds?.length && <GoToCreateGuildButton />}
        />

        <YourGuilds ref={yourGuildsRef} />

        <ExploreAllGuilds ref={allGuildsRef} {...{ guildsInitial }} />
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const guilds = await fetcher(`/guild?sort=members`).catch((_) => [])

  return {
    props: { guilds },
    revalidate: 300,
  }
}

export default Page
