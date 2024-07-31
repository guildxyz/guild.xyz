"use client"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/Chart"
import { Bar, BarChart, XAxis } from "recharts"

const chartData = [
  { date: "2024-06-19", experience: 341 },
  { date: "2024-06-20", experience: 408 },
  { date: "2024-06-21", experience: 169 },
  { date: "2024-06-22", experience: 317 },
  { date: "2024-06-23", experience: 480 },
  { date: "2024-06-24", experience: 132 },
  { date: "2024-06-25", experience: 141 },
  { date: "2024-06-26", experience: 434 },
  { date: "2024-06-13", experience: 81 },
  { date: "2024-06-14", experience: 426 },
  { date: "2024-06-15", experience: 307 },
  { date: "2024-06-16", experience: 371 },
  { date: "2024-06-17", experience: 475 },
  { date: "2024-06-18", experience: 107 },
  { date: "2024-06-19", experience: 341 },
  { date: "2024-06-20", experience: 408 },
  { date: "2024-06-21", experience: 169 },
  { date: "2024-06-22", experience: 317 },
  { date: "2024-06-23", experience: 480 },
  { date: "2024-06-24", experience: 132 },
  { date: "2024-06-25", experience: 141 },
  { date: "2024-06-26", experience: 434 },
  { date: "2024-06-27", experience: 448 },
  { date: "2024-06-28", experience: 149 },
  { date: "2024-06-29", experience: 103 },
  { date: "2024-06-30", experience: 446 },
  { date: "2024-06-24", experience: 132 },
  { date: "2024-06-25", experience: 141 },
  { date: "2024-06-26", experience: 434 },
  { date: "2024-06-27", experience: 448 },
  { date: "2024-06-28", experience: 149 },
  { date: "2024-06-29", experience: 103 },
  { date: "2024-06-30", experience: 446 },
]
const chartConfig = {
  views: {
    label: "Gained XP",
  },
  experience: {
    label: "experience",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function ActivityChart() {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[65px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tick={false}
          height={0}
          tickFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              nameKey="views"
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }}
            />
          }
        />
        <Bar dataKey="experience" fill="var(--color-experience)" radius={999} />
      </BarChart>
    </ChartContainer>
  )
}
