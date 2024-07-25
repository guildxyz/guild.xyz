"use client"

import { ChartContainer } from "@/components/ui/Chart"
import { RadialBar, RadialBarChart } from "recharts"

const chartData = [{ experience: 1, fill: "hsl(var(--primary))" }]

export const CircularProgressBar = () => {
  return (
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
        <circle
          className="stroke-muted"
          cx={224 >> 1}
          cy={224 >> 1}
          r={103}
          strokeWidth={13}
          fill="none"
        />
        <RadialBar dataKey="experience" cornerRadius={10} />
      </RadialBarChart>
    </ChartContainer>
  )
}
