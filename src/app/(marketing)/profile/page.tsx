"use client"

import { Layout } from "@/components/Layout"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { ChartConfig, ChartContainer } from "@/components/ui/Chart"
import { PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

const chartData = [{ browser: "safari", visitors: 200, fill: "hsl(var(--primary))" }]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const Page = () => {
  return (
    <Layout.Root className="relative min-h-screen">
      <Layout.Hero>
        <Layout.Header />
        <Layout.Banner offset={100} className="border-border border-b border-dashed">
          <div className="absolute inset-0 bg-[auto_115%] bg-[top_5px_right_0] bg-[url('/banner.svg')] opacity-10" />
        </Layout.Banner>
      </Layout.Hero>
      <Layout.Main>
        <div className="flex flex-col items-center gap-2">
          <div className="mb-8">
            <ChartContainer
              config={chartConfig}
              className="aspect-square size-56 outline"
            >
              <RadialBarChart
                data={chartData}
                startAngle={0}
                endAngle={100}
                innerRadius={80}
                outerRadius={110}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[86, 74]}
                />
                <RadialBar dataKey="visitors" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false} />
              </RadialBarChart>
            </ChartContainer>
            <Avatar className="size-48">
              <AvatarFallback>#</AvatarFallback>
            </Avatar>
          </div>
          <h1 className="whitespace-nowrap font-bold text-4xl tracking-tighter">
            Maximillian Xiaohua Longname
          </h1>
          <div className="text-muted-foreground">@stephaniexixo11</div>
          <p className="mt-6 max-w-md text-pretty text-center text-lg text-muted-foreground">
            This is a description that perfectly matches the 80 character description
            limit.
          </p>
        </div>
      </Layout.Main>
    </Layout.Root>
  )
}

// biome-ignore lint/style/noDefaultExport: page route
export default Page
