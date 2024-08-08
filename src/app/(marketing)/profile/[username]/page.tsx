import { Header } from "@/components/Header"
import {
  Layout,
  LayoutBanner,
  LayoutFooter,
  LayoutHero,
  LayoutMain,
} from "@/components/Layout"
import { SWRProvider } from "@/components/SWRProvider"
import { Anchor } from "@/components/ui/Anchor"
import { Schemas } from "@guildxyz/types"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { env } from "env"
import { unstable_serialize } from "swr"
import { Profile } from "../_components/Profile"

const Page = async ({ params: { username } }: { params: { username: string } }) => {
  const api = env.NEXT_PUBLIC_API.replace("/v1", "")
  const profileRequest = new URL(`v2/profiles/${username}`, api)
  const contributionsRequest = new URL(`v2/profiles/${username}/contributions`, api)
  console.log({ profileRequest, contributionsRequest, api })
  const contributions = (await (
    await fetch(contributionsRequest, {
      next: {
        tags: ["contributions"],
        revalidate: 600,
      },
    })
  ).json()) as Schemas["Contribution"][]

  const profile = (await (
    await fetch(profileRequest, {
      next: {
        tags: ["profile"],
        revalidate: 600,
      },
    })
  ).json()) as Schemas["Profile"]

  return (
    <SWRProvider
      value={{
        fallback: {
          [unstable_serialize(profileRequest.pathname)]: profile,
          [unstable_serialize(contributionsRequest.pathname)]: contributions,
        },
      }}
    >
      <Layout>
        <LayoutHero>
          <Header />
          <LayoutBanner className="-bottom-[500px]">
            <div className="absolute inset-0 bg-[url('/banner.svg')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background" />
          </LayoutBanner>
        </LayoutHero>
        <LayoutMain>
          <Profile />
        </LayoutMain>
        <LayoutFooter>
          <p className="mb-12 text-center font-medium text-muted-foreground">
            Guild Profiles are currently in invite only early access, only available
            to{" "}
            <Anchor
              href={"#"}
              className="inline-flex items-center gap-1"
              variant="muted"
            >
              Subscribers
              <ArrowRight />
            </Anchor>
          </p>
        </LayoutFooter>
      </Layout>
    </SWRProvider>
  )
}

// biome-ignore lint/style/noDefaultExport: page route
export default Page
