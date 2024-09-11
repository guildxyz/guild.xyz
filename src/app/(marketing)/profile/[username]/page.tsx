import { Header } from "@/components/Header"
import {
  Layout,
  LayoutBanner,
  LayoutFooter,
  LayoutHero,
  LayoutMain,
} from "@/components/Layout"
import { SWRProvider } from "@/components/SWRProvider"
import { FarcasterProfile, Guild, Role, Schemas } from "@guildxyz/types"
import { env } from "env"
import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { JoinProfileAction } from "../_components/JoinProfileAction"
import { Profile } from "../_components/Profile"
import { ProfileColorBanner } from "../_components/ProfileColorBanner"
import { ProfileHero } from "../_components/ProfileHero"

type PageProps = { params: { username: string } }

export const generateMetadata = async ({ params: { username } }: PageProps) => {
  const { profile } = await fetchPublicProfileData({
    username,
    fetchFallback: false,
  })
  return {
    title: `${profile.name || profile.username} (@${profile.username}) | Guild.xyz`,
    description: profile.bio,
    openGraph: {
      images: [profile.profileImageUrl, profile.backgroundImageUrl].filter(
        Boolean
      ) as string[],
    },
  } satisfies Metadata
}

const api = env.NEXT_PUBLIC_API

async function ssrFetcher<T>(...args: Parameters<typeof fetch>) {
  return (await fetch(...args)).json() as T
}

const fetchPublicProfileData = async ({
  username,
  fetchFallback = true,
}: { username: string; fetchFallback?: boolean }) => {
  const profileRequest = new URL(`v2/profiles/${username}`, api)
  const profileResponse = await fetch(profileRequest, {
    next: {
      tags: [profileRequest.pathname],
      revalidate: 3600,
    },
  })

  if (profileResponse.status === 404) notFound()
  if (!profileResponse.ok) throw new Error("couldn't to fetch /profile")

  const profile = (await profileResponse.json()) as Schemas["Profile"]
  if (!fetchFallback) {
    return { profile }
  }
  const farcasterProfilesRequest = new URL(
    `/v2/users/${profile.userId}/farcaster-profiles`,
    api
  )
  const farcasterProfiles = await ssrFetcher<FarcasterProfile[]>(
    farcasterProfilesRequest,
    {
      next: {
        tags: [farcasterProfilesRequest.pathname],
        revalidate: 3600,
      },
    }
  )
  const fcProfile = farcasterProfiles.at(0)
  const neynarRequest =
    fcProfile &&
    new URL(
      `https://api.neynar.com/v2/farcaster/user/bulk?api_key=NEYNAR_API_DOCS&fids=${fcProfile.fid}`
    )
  const fcFollowers =
    neynarRequest &&
    (await ssrFetcher(neynarRequest, {
      next: {
        revalidate: 12 * 3600,
      },
    }))

  const referredUsersRequest = new URL(
    `/v2/profiles/${username}/referred-users`,
    api
  )
  const referredUsers = await ssrFetcher<Schemas["Profile"][]>(
    referredUsersRequest,
    {
      next: {
        tags: [profileRequest.pathname],
        revalidate: 3600,
      },
    }
  )
  const contributionsRequest = new URL(`v2/profiles/${username}/contributions`, api)
  const contributions = await ssrFetcher<Schemas["Contribution"][]>(
    contributionsRequest,
    {
      next: {
        tags: [contributionsRequest.pathname],
        revalidate: 3600,
      },
    }
  )
  const collectionRequests = contributions.map(
    ({ id }) =>
      new URL(`v2/profiles/${username}/contributions/${id}/collection`, api)
  )
  let collections: Schemas["ContributionCollection"][] | undefined
  try {
    collections = await Promise.all(
      collectionRequests.map((req) =>
        ssrFetcher<Schemas["ContributionCollection"]>(req, {
          next: {
            tags: ["collections"],
            revalidate: 3600,
          },
        })
      )
    )
  } catch (e) {
    console.error(e)
  }
  const roleRequests = contributions.map(
    ({ roleId, guildId }) => new URL(`v2/guilds/${guildId}/roles/${roleId}`, api)
  )
  const guildRequests = contributions.map(
    ({ guildId }) => new URL(`v2/guilds/${guildId}`, api)
  )
  const guilds = await Promise.all(
    guildRequests.map((req) =>
      ssrFetcher<Guild>(req, {
        next: {
          revalidate: 3 * 3600,
        },
      })
    )
  )
  const roles = await Promise.all(
    roleRequests.map((req) =>
      ssrFetcher<Role>(req, {
        next: {
          revalidate: 3 * 3600,
        },
      })
    )
  )
  const collectionsZipped = collections
    ? collectionRequests.map(({ pathname }, i) => [pathname, collections[i]])
    : []
  const guildsZipped = guildRequests.map(({ pathname }, i) => [pathname, guilds[i]])
  const rolesZipped = roleRequests.map(({ pathname }, i) => [pathname, roles[i]])
  const experiencesRequest = new URL(`/v2/profiles/${username}/experiences`, api)
  const experiences = await ssrFetcher<Schemas["Experience"][]>(experiencesRequest, {
    next: {
      revalidate: 1200,
    },
  })
  const experienceCountRequest = new URL(
    `/v2/profiles/${username}/experiences?count=true`,
    api
  )
  const experienceCount = await ssrFetcher<number>(experienceCountRequest, {
    next: {
      revalidate: 1200,
    },
  })

  return {
    profile,
    fallback: Object.fromEntries(
      [
        [profileRequest.pathname, profile],
        [contributionsRequest.pathname, contributions],
        [farcasterProfilesRequest.pathname, farcasterProfiles],
        [neynarRequest?.href, fcFollowers],
        [referredUsersRequest.pathname, referredUsers],
        [experiencesRequest.pathname, experiences],
        [
          experienceCountRequest.pathname + experienceCountRequest.search,
          experienceCount,
        ],
        ...collectionsZipped,
        ...guildsZipped,
        ...rolesZipped,
      ].filter(([key, value]) => key && value)
    ),
  }
}

const Page = async ({ params: { username } }: PageProps) => {
  let profileData: Awaited<ReturnType<typeof fetchPublicProfileData>>
  try {
    profileData = await fetchPublicProfileData({ username })
  } catch (error) {
    const e = error instanceof Error ? error : undefined
    throw new Error(
      ["Failed to retrieve profile data", e?.message].filter(Boolean).join(": ")
    )
  }
  const { profile, fallback } = profileData

  const isBgColor = profile.backgroundImageUrl?.startsWith("#")

  return (
    <SWRProvider
      value={{
        fallback,
      }}
    >
      <Layout>
        <LayoutHero className="pb-0">
          <Header />
          <LayoutBanner
            className="-bottom-[100px]"
            data-theme="dark"
            style={
              isBgColor ? { ["--banner" as string]: profile.backgroundImageUrl } : {}
            }
          >
            {isBgColor ? (
              <ProfileColorBanner />
            ) : (
              profile.backgroundImageUrl && (
                <Image
                  src={profile.backgroundImageUrl}
                  fill
                  sizes="100vw"
                  alt="profile background image"
                  priority
                  style={{
                    filter: "brightness(50%)",
                    objectFit: "cover",
                  }}
                />
              )
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background" />
          </LayoutBanner>
          <ProfileHero />
        </LayoutHero>
        <LayoutMain className="top-0">
          <Profile />
        </LayoutMain>
        <LayoutFooter className="pt-28 pb-5">
          <p className="text-center font-medium text-muted-foreground">
            Guild Profiles are currently in early access.
          </p>
        </LayoutFooter>
      </Layout>
      <JoinProfileAction />
    </SWRProvider>
  )
}

// biome-ignore lint/style/noDefaultExport: page route
export default Page
