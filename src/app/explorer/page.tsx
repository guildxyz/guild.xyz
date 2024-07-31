import { Header } from "@/components/Header"
import {
  Layout,
  LayoutBanner,
  LayoutFooter,
  LayoutHeadline,
  LayoutHero,
  LayoutMain,
  LayoutTitle,
} from "@/components/Layout"
import { env } from "env"
import { unstable_serialize as infinite_unstable_serialize } from "swr/infinite"
import { SearchParams } from "types"
import { Explorer } from "./_components/Explorer"
import { ExplorerSWRProvider } from "./_components/ExplorerSWRProvider"
import { HeaderBackground } from "./_components/HeaderBackground"
import { ActiveSection } from "./types"

export const metadata = {
  icons: {
    // @ts-ignore: "as" prop not typed out.
    other: [{ rel: "preload", url: "/banner.svg", as: "image" }],
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
          <LayoutBanner>
            <div className="absolute inset-0 bg-[auto_115%] bg-[right_top_10px] bg-[url('/banner.svg')] bg-no-repeat opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-50% from-banner to-transparent" />
          </LayoutBanner>

          <Header />

          <LayoutHeadline id={ActiveSection.YourGuilds}>
            <LayoutTitle>Guildhall</LayoutTitle>
          </LayoutHeadline>
        </LayoutHero>

        <LayoutMain>
          <Explorer searchParams={searchParams} />
        </LayoutMain>

        <LayoutFooter />
      </Layout>
    </ExplorerSWRProvider>
  )
}

export default Page
