import {
  Layout,
  LayoutBanner,
  LayoutFooter,
  LayoutHeader,
  LayoutHero,
  LayoutMain,
} from "@/components/Layout"
import { Anchor } from "@/components/ui/Anchor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { AvatarGroup } from "@/components/ui/AvatarGroup"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Progress } from "@/components/ui/Progress"
import { Separator } from "@/components/ui/Separator"
import { ArrowRight, CircleWavyCheck } from "@phosphor-icons/react/dist/ssr"
import { ActivityChart } from "../_components/ActivityChart"
import { CircularProgressBar } from "../_components/CircularProgressBar"
import { ContributionCard } from "../_components/ContributionCard"
import { RecentActivity } from "../_components/RecentActivity"

function generatePolygonClipPath(sides: number): string {
  const angle = (2 * Math.PI) / sides
  const path = Array.from({ length: sides }, (_, i) => {
    const x = 50 + 50 * Math.cos(i * angle)
    const y = 50 + 50 * Math.sin(i * angle)
    return `${x}% ${y}%`
  }).join(", ")

  return `polygon(${path}, round 10px)`
}

const LevelPolygon = () => {
  return (
    <div
      className="absolute right-0 bottom-0 flex size-12 items-center justify-center bg-primary-subtle font-extrabold text-xl shadow-lg"
      style={{ clipPath: generatePolygonClipPath(5) }}
    >
      22
    </div>
  )
}

async function getProfileData(username: string) {
  const req = `https://api.guild.xyz/v2/profiles/${username}`
  try {
    const res = await fetch(req)
    if (!res.ok) {
      throw new Error("Failed to fetch profile data")
    }
    return res.json() as Promise<Profile>
  } catch (e) {
    // mocking for the time being if fetch fails
    console.error(e)
    const res = {
      id: 4,
      userId: 6027190,
      username: "durumm",
      name: "durum",
      bio: null,
      profileImageUrl:
        "https://guild-xyz.mypinata.cloud/ipfs/QmWGdo6FkjSz22oDZFMJysx3hGKoVqtzTWVMx9tTSP7jvi",
      backgroundImageUrl: null,
      createdAt: "2024-07-25T10:04:20.781Z",
      updatedAt: "2024-07-25T10:04:20.781Z",
    }
    return res
  }
}

// TODO: try get this from the backend if not possible write zod validation
interface Profile {
  id: number
  userId: number
  username: string
  name: string
  bio: null | string
  profileImageUrl: null | string
  backgroundImageUrl: null | string
  createdAt: string
  updatedAt: string
}

const Page = async ({
  params: { username },
}: {
  params: { username: string }
}) => {
  const profile = await getProfileData(username)

  return (
    <Layout>
      <LayoutHero>
        <LayoutHeader />
        <LayoutBanner className="-bottom-[500px]">
          <div className="absolute inset-0 bg-[url('/banner.svg')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background" />
        </LayoutBanner>
      </LayoutHero>
      <LayoutMain>
        <div className="mt-24">
          <div className="mb-24 flex flex-col items-center">
            <div className="relative mb-12 flex items-center justify-center">
              <Avatar className="size-48">
                <AvatarImage
                  src={profile.profileImageUrl ?? ""}
                  alt="profile"
                  width={192}
                  height={192}
                />
                <AvatarFallback>#</AvatarFallback>
              </Avatar>
              <CircularProgressBar />
              <LevelPolygon />
            </div>
            <h1 className="text-center font-bold text-4xl leading-normal tracking-tight">
              {profile.name}
              <CircleWavyCheck
                weight="fill"
                className="ml-4 inline size-6 fill-yellow-500"
              />
            </h1>
            <div className="text-lg text-muted-foreground">@{profile.username}</div>
            <p className="mt-6 max-w-md text-pretty text-center text-lg text-muted-foreground">
              {profile.bio ?? "Write your bio"}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
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
              <div className="flex items-center gap-2">
                <AvatarGroup imageUrls={["", ""]} count={8} />
                <div className="text-muted-foreground leading-tight">
                  Followed by <span className="font-bold">Hoho</span>,<br />
                  <span className="font-bold">Hihi</span> and 22 others
                </div>
              </div>
            </div>
          </div>
          <h2 className="mb-3 font-bold text-lg">Experience</h2>
          <div className="mb-16 grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card className="p-6">
              <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto_auto] items-center gap-x-3 gap-y-2">
                <div className="row-span-3 flex size-12 items-center justify-center place-self-center self-start rounded-xl bg-primary font-extrabold text-xl shadow-lg">
                  22
                </div>
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
          </div>
          <h2 className="mb-3 font-bold text-lg">Top contributions</h2>
          <div className="grid grid-cols-1 gap-3">
            <ContributionCard />
            <ContributionCard />
            <ContributionCard />
            <Button size="sm" variant="outline" className="place-self-center">
              See more involvement
            </Button>
          </div>
          <div className="mt-8">
            <h2 className="mb-3 font-bold text-lg">Recent activity</h2>
            <RecentActivity />
            <p className="mt-2 font-semibold text-muted-foreground">
              ... only last 20 actions are shown
            </p>
          </div>
        </div>
      </LayoutMain>
      <LayoutFooter>
        <p className="mt-24 mb-12 text-center font-medium text-muted-foreground">
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
