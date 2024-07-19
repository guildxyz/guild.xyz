"use client"

import {
  Layout,
  LayoutBanner,
  LayoutHeader,
  LayoutHero,
  LayoutMain,
} from "@/components/Layout"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { Card } from "@/components/ui/Card"
import { ChartContainer } from "@/components/ui/Chart"
import { Separator } from "@/components/ui/Separator"
import { CircleWavyCheck } from "@phosphor-icons/react"
import { RadialBar, RadialBarChart } from "recharts"

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
                className="-rotate-90 absolute aspect-square min-h-56"
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
              <Separator orientation="vertical" className="hidden sm:block" />
              <div className="flex flex-col items-center leading-tight">
                <div className="font-bold text-lg">0</div>
                <div className="text-muted-foreground">Followers</div>
              </div>
              <Separator orientation="vertical" className="hidden sm:block" />
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>#</AvatarFallback>
                </Avatar>
                <div className="text-muted-foreground leading-tight">
                  Followed by <span className="font-bold">Hoho</span>,<br />
                  <span className="font-bold">Hihi</span> and 22 others
                </div>
              </div>
            </div>
          </div>
          <Separator className="mt-16 mb-8" />
          <div className="w-full">
            <h2 className="mb-3 font-bold text-lg">Experience</h2>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-6">
                <h3 className="font-bold">Champion</h3>
                <p className="text-muted-foreground">Description</p>
              </Card>
              <Card className="p-6">
                <h3>Engagement this month</h3>
              </Card>
            </div>
          </div>
          <Separator className="mt-16 mb-8" />
        </div>
      </LayoutMain>
    </Layout>
  )
}

// biome-ignore lint/style/noDefaultExport: page route
export default Page
