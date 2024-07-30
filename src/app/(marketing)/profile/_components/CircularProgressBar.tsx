"use client"

import { ChartContainer } from "@/components/ui/Chart"
import { RadialBar, RadialBarChart } from "recharts"

const chartData = [{ experience: 1, fill: "hsl(var(--primary))" }]

export const CircularProgressBar = ({ progress }: { progress: number }) => {
  const size = 224
  const strokeWidth = 10
  return (
    <ChartContainer
      config={{}}
      className="-scale-x-100 absolute aspect-square rotate-90"
      style={{ minHeight: size }}
    >
      <RadialBarChart
        data={chartData}
        startAngle={0}
        endAngle={360 * progress}
        innerRadius={106}
        outerRadius={116}
      >
        <circle
          className="stroke-muted"
          cx={size >> 1}
          cy={size >> 1}
          r={(size >> 1) - (strokeWidth >> 1) - 1}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <RadialBar dataKey="experience" cornerRadius={10} />
      </RadialBarChart>
    </ChartContainer>
  )
}
