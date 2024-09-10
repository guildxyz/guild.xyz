import { Skeleton } from "@/components/ui/Skeleton"
import { Schemas } from "@guildxyz/types"
import { Group } from "@visx/group"
import { scaleBand, scaleLinear } from "@visx/scale"
import { Bar } from "@visx/shape"
import { useMemo } from "react"
import { useExperiences } from "../_hooks/useExperiences"

const verticalMargin = 0

const getX = (xp: Schemas["Experience"]) => xp.id.toString()
const getY = (xp: Schemas["Experience"]) => xp.amount

export type BarsProps = {
  width: number
  height: number
}

export const ActivityChart = ({ width, height }: BarsProps) => {
  const { data } = useExperiences({ count: false })
  if (!data) return <Skeleton style={{ width, height }} />
  const xMax = width
  const yMax = height - verticalMargin
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: data.map(getX),
        padding: 0.4,
      }),
    [xMax]
  )
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(getY))],
      }),
    [yMax]
  )

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <Group top={verticalMargin / 2}>
        {data.map((xp) => {
          const x = getX(xp)
          const barWidth = xScale.bandwidth()
          const barHeight = yMax - (yScale(getY(xp)) ?? 0)
          const barX = xScale(x)
          const barY = yMax - barHeight
          return (
            <Bar
              ry={3}
              key={xp.id}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="hsl(var(--primary))"
            />
          )
        })}
      </Group>
    </svg>
  )
}
