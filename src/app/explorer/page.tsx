import {
  Layout,
  LayoutBanner,
  LayoutFooter,
  LayoutHeader,
  LayoutHeadline,
  LayoutHero,
  LayoutMain,
} from "@/components/Layout"
import { LayoutBannerBackground } from "@/components/Layout/Layout"
import { Anchor } from "@/components/ui/Anchor"
import { env } from "env"
import { unstable_serialize as infinite_unstable_serialize } from "swr/infinite"
import { SearchParams } from "types"
import { Explorer } from "./_components/Explorer"
import { ExplorerSWRProvider } from "./_components/ExplorerSWRProvider"
import { HeaderBackground } from "./_components/HeaderBackground"
import { ActiveSection } from "./types"

export const metadata = {
  icons: {
    other: [{ rel: "preload", url: "/banner.svg" }],
  },
}

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const featuredPath = `/v2/guilds?order=FEATURED&offset=0&limit=24`
  const newestPath = `/v2/guilds?order=NEWEST&offset=0&limit=24`
  const [ssrFeaturedGuilds, ssrNewestGuilds] = await Promise.all([
    fetch(`${env.NEXT_PUBLIC_API.replace("/v1", "")}${featuredPath}`, {
      next: {
        revalidate: 600,
      },
    })
      .then((res) => res.json())
      .catch((_) => []),
    fetch(`${env.NEXT_PUBLIC_API.replace("/v1", "")}${newestPath}`, {
      next: {
        revalidate: 600,
      },
    })
      .then((res) => res.json())
      .catch((_) => []),
  ])

  return (
    <ExplorerSWRProvider
      value={{
        fallback: {
          [infinite_unstable_serialize(() => featuredPath)]: ssrFeaturedGuilds,
          [infinite_unstable_serialize(() => newestPath)]: ssrNewestGuilds,
        },
      }}
    >
      <HeaderBackground />
      <Layout>
        <LayoutHero>
          <LayoutHeader />
          <div id={ActiveSection.YourGuilds}>
            <LayoutHeadline title="Guildhall" />
          </div>
          <LayoutBanner>
            <LayoutBannerBackground />
            <div className="absolute inset-0 bg-[auto_115%] bg-[right_top_10px] bg-[url('/banner.svg')] bg-no-repeat opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-50% from-banner to-transparent" />
          </LayoutBanner>
        </LayoutHero>

        <LayoutMain>
          <Explorer searchParams={searchParams} />
        </LayoutMain>

        <LayoutFooter>
          <p className="my-8 text-center text-muted-foreground text-sm">
            {`This website is `}
            <Anchor
              href="https://github.com/guildxyz/guild.xyz"
              target="_blank"
              showExternal
            >
              open source
            </Anchor>
            {`, and built on the `}
            <Anchor
              target="_blank"
              href="https://www.npmjs.com/package/@guildxyz/sdk"
              showExternal
            >
              Guild SDK
            </Anchor>
          </p>
        </LayoutFooter>
      </Layout>
    </ExplorerSWRProvider>
  )
}

export default Page
