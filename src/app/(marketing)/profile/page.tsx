"use client"

import {
  Layout,
  LayoutBanner,
  LayoutHeader,
  LayoutHero,
  LayoutMain,
} from "@/components/Layout"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { AvatarGroup } from "@/components/ui/AvatarGroup"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { ChartContainer } from "@/components/ui/Chart"
import { Progress } from "@/components/ui/Progress"
import { Separator } from "@/components/ui/Separator"
import { CaretDown, CircleWavyCheck, Users } from "@phosphor-icons/react"
import { RadialBar, RadialBarChart } from "recharts"
import { ActivityChart } from "./_components/ActivityChart"

const chartData = [{ experience: 1, fill: "hsl(var(--primary))" }]

const Page = () => {
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
          <div className="flex flex-col items-center">
            <div className="relative mb-12 flex items-center justify-center">
              <ChartContainer
                config={{}}
                className="-scale-x-100 absolute aspect-square min-h-56 rotate-90"
              >
                <RadialBarChart
                  data={chartData}
                  startAngle={0}
                  endAngle={280}
                  innerRadius={105}
                  outerRadius={115}
                >
                  <RadialBar dataKey="experience" cornerRadius={10} />
                </RadialBarChart>
              </ChartContainer>
              <Avatar className="size-48">
                <AvatarFallback>#</AvatarFallback>
              </Avatar>
              <div className="absolute right-0 bottom-0 flex size-12 items-center justify-center rounded-xl bg-primary font-extrabold text-xl shadow-lg">
                22
              </div>
            </div>
            <h1 className="text-center font-bold text-4xl leading-normal tracking-tight">
              Maximillian Xiaohua Longname
              <CircleWavyCheck
                weight="fill"
                className="ml-4 inline size-6 fill-yellow-500"
              />
            </h1>
            <div className="text-lg text-muted-foreground">@stephaniexixo11</div>
            <p className="mt-6 max-w-md text-pretty text-center text-lg text-muted-foreground">
              This is a description that perfectly matches the 80 character
              description limit.
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
          <Separator className="mt-16 mb-8" />
          <h2 className="mb-3 font-bold text-lg">Experience</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card className="p-6">
              <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto_auto] items-center gap-x-6 gap-y-2">
                <div className="row-span-3 flex size-12 items-center justify-center place-self-center rounded-xl bg-primary font-extrabold text-xl shadow-lg">
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
          <Separator className="my-8" />
          <h2 className="mb-3 font-bold text-lg">Top contributions</h2>
          <div className="grid grid-cols-1 gap-3">
            <ContributionCard />
            <ContributionCard />
            <ContributionCard />
            <Button size="sm" variant="outline" className="place-self-center">
              See more involvement
            </Button>
          </div>
        </div>
        <Separator className="mt-8 mb-32" />
      </LayoutMain>
    </Layout>
  )
}
const ContributionCard = () => {
  return (
    <Card className="flex border-2">
      <div className="relative h-full w-10 bg-border">
        <div className="-translate-x-1/2 -rotate-90 absolute bottom-1/2 left-1/2 flex translate-y-1/2 items-center gap-1">
          <Avatar size="sm">
            <AvatarFallback>#</AvatarFallback>
          </Avatar>
          <div className="max-w-12 truncate font-bold font-display">Guild</div>
        </div>
      </div>
      <div className="grid w-full grid-cols-[auto_1fr] items-center gap-4 p-6 md:grid-cols-[auto_auto_1fr]">
        <Avatar className="size-16 sm:size-20">
          <AvatarFallback>#</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-extrabold text-muted-foreground text-xs uppercase">
            TOP ROLE
          </div>
          <h3 className="mb-1 font-bold font-display text-xl tracking-tight">
            Enter Farcaster
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users weight="bold" className="min-w-4" />
            <p className="line-clamp-1 text-sm">Only 3.4% of users have this role</p>
          </div>
        </div>
        <div className="col-span-2 flex w-full flex-col gap-2 justify-self-end md:col-span-1 md:w-auto md:flex-row md:items-center">
          <Separator className="mb-2 md:hidden" />
          <div className="font-extrabold text-muted-foreground text-xs uppercase">
            COLLECTION:
          </div>
          <AvatarGroup imageUrls={["", "", ""]} count={87} size="lg" />
          <CaretDown weight="bold" className="ml-2 hidden size-5 md:block" />
        </div>
      </div>
    </Card>
  )
}

// biome-ignore lint/style/noDefaultExport: page route
export default Page
