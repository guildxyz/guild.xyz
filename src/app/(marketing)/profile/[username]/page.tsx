"use client"

import { CheckMark } from "@/components/CheckMark"
import { Header } from "@/components/Header"
import {
  Layout,
  LayoutBanner,
  LayoutFooter,
  LayoutHero,
  LayoutMain,
} from "@/components/Layout"
import { Anchor } from "@/components/ui/Anchor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { AvatarGroup } from "@/components/ui/AvatarGroup"
import { Separator } from "@/components/ui/Separator"
import { Skeleton } from "@/components/ui/Skeleton"
import { useUserPublic } from "@/hooks/useUserPublic"
import { Schemas } from "@guildxyz/types"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { useAtom } from "jotai"
import { useEffect } from "react"
import useSWR from "swr"
import { fetcherForSWR } from "utils/fetcher"
import { CircularProgressBar } from "../_components/CircularProgressBar"
import { ContributionCard } from "../_components/ContributionCard"
import { EditContributions } from "../_components/EditContributions"
import { EditProfile } from "../_components/EditProfile"
import { LevelBadge } from "../_components/LevelBadge"
import { OperatedGuildCard } from "../_components/OperatedGuildCard"
import { ProfileSkeleton } from "../_components/ProfileSkeleton"
import { RecentActivity } from "../_components/RecentActivity"
import { useContribution } from "../_hooks/useContribution"
import { profileAtom } from "./atoms"

// async function getProfileData(username: string) {
//   const req = `https://api.guild.xyz/v2/profiles/${username}`
//   try {
//     const res = await fetch(req)
//     if (!res.ok) {
//       throw new Error("Failed to fetch profile data")
//     }
//     return res.json() as Promise<Schemas["Profile"]>
//   } catch (e) {
//     // mocking for the time being if fetch fails
//     console.error(e)
//     const res = {
//       id: 4,
//       userId: 6027190,
//       username: "durumm",
//       name: "durum",
//       bio: null,
//       profileImageUrl:
//         "https://guild-xyz.mypinata.cloud/ipfs/QmWGdo6FkjSz22oDZFMJysx3hGKoVqtzTWVMx9tTSP7jvi",
//       backgroundImageUrl: null,
//       createdAt: "2024-07-25T10:04:20.781Z",
//       updatedAt: "2024-07-25T10:04:20.781Z",
//     }
//     return res
//   }
// }

const Page = ({
  params: { username },
}: {
  params: { username: string }
}) => {
  const { data: fetchedProfile, isLoading } = useSWR<Schemas["Profile"]>(
    `/v2/profiles/${username}`,
    fetcherForSWR
  )
  const [profile, setProfile] = useAtom(profileAtom)
  const contributions = useContribution()
  const level = 0

  const { id: publicUserId } = useUserPublic()
  const isProfileOwner = !!profile?.userId && publicUserId === profile.userId
  useEffect(() => {
    setProfile(fetchedProfile)
  }, [fetchedProfile, setProfile])

  if (!profile || isLoading) {
    return <ProfileSkeleton />
  }

  return (
    <Layout>
      <LayoutHero>
        <Header />
        <LayoutBanner className="-bottom-[500px]">
          <div className="absolute inset-0 bg-[url('/banner.svg')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background" />
        </LayoutBanner>
      </LayoutHero>
      <LayoutMain>
        <div className="mt-24">
          <div className="relative mb-24 flex flex-col items-center">
            <EditProfile
              profileImageUrl={profile.profileImageUrl}
              name={profile.name}
              bio={profile.bio ?? undefined}
              backgroundImageUrl={profile.backgroundImageUrl ?? undefined}
              username={profile.username}
            />
            <div className="relative mb-12 flex items-center justify-center">
              <Avatar className="size-48">
                <AvatarImage
                  src={profile.profileImageUrl ?? ""}
                  alt="profile"
                  width={192}
                  height={192}
                />
                <AvatarFallback>
                  <Skeleton className="size-full" />
                </AvatarFallback>
              </Avatar>
              <CircularProgressBar progress={0.1} />
              <LevelBadge level={level} className="absolute right-0 bottom-0" />
            </div>
            <h1 className="text-center font-bold text-4xl leading-normal tracking-tight">
              {profile.name}
              <CheckMark className="ml-2 inline size-6 fill-yellow-500" />
            </h1>
            <div className="text-lg text-muted-foreground">@{profile.username}</div>
            <p className="mt-6 max-w-md text-pretty text-center text-lg text-muted-foreground">
              {profile.bio}
            </p>
            <div className="mt-8 grid grid-cols-[repeat(3,auto)] gap-x-8 gap-y-6 sm:grid-cols-[repeat(5,auto)]">
              <div className="flex flex-col items-center leading-tight">
                <div className="font-bold text-lg">3232</div>
                <div className="text-muted-foreground">Guildmates</div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="flex flex-col items-center leading-tight">
                <div className="font-bold text-lg">0</div>
                <div className="text-muted-foreground">Followers</div>
              </div>
              <Separator orientation="vertical" className="hidden h-12 sm:block" />
              <div className="col-span-3 flex items-center gap-2 place-self-center sm:col-span-1">
                <AvatarGroup imageUrls={["", ""]} count={8} />
                <div className="text-muted-foreground leading-tight">
                  Followed by <span className="font-bold">Hoho</span>,<br />
                  <span className="font-bold">Hihi</span> and 22 others
                </div>
              </div>
            </div>
          </div>
          {/* <h2 className="mb-3 font-bold text-lg">Experience</h2>
          <div className="mb-16 grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card className="p-6">
              <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto_auto] items-center gap-x-3 gap-y-2">
                <LevelBadge
                  level={level}
                  className="row-span-3 size-14 self-start justify-self-center"
                />
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <h3 className="font-bold">Champion</h3>
                  <p className="text-muted-foreground">1322 / 9999 XP</p>
                </div>
                <Progress value={77} />
                <p className="text-muted-foreground">
                  This is a description that perfectly matches the 80 character
                  description limit.
                </p>
              </div>
            </Card>
            <Card className="space-y-4 p-6">
              <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
                <h3 className="font-bold">Engagement this month</h3>
                <Badge colorScheme="blue">+72 XP</Badge>
              </div>
              <ActivityChart />
            </Card>
          </div> */}
          <h2 className="mb-3 font-bold text-lg">Operated guilds</h2>
          <OperatedGuildCard />
          <div className="mt-8 mb-3 flex items-center justify-between">
            <h2 className="font-bold text-lg">Top contributions</h2>
            {isProfileOwner && <EditContributions />}
          </div>
          <div className="grid grid-cols-1 gap-3">
            {contributions.data?.map((contribution) => (
              <ContributionCard contribution={contribution} key={contribution.id} />
            ))}
          </div>
          <div className="mt-8">
            <h2 className="mb-3 font-bold text-lg">Recent activity</h2>
            <RecentActivity />
            <p className="mt-2 font-semibold text-muted-foreground">
              &hellip; only last 20 actions are shown
            </p>
          </div>
        </div>
      </LayoutMain>
      <LayoutFooter>
        <p className="mb-12 text-center font-medium text-muted-foreground">
          Guild Profiles are currently in invite only early access, only available to{" "}
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
  )
}

// biome-ignore lint/style/noDefaultExport: page route
export default Page
