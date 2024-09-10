import { Skeleton } from "@/components/ui/Skeleton"
import { Schemas } from "@guildxyz/types"
import { localPoint } from "@visx/event"
import { Group } from "@visx/group"
import { scaleBand, scaleLinear } from "@visx/scale"
import { Bar } from "@visx/shape"
import { useTooltip, useTooltipInPortal } from "@visx/tooltip"
import { useMemo } from "react"
import { useExperiences } from "../_hooks/useExperiences"

type TooltipData = Schemas["Experience"]
const verticalMargin = 0

const getX = (xp: Schemas["Experience"]) => xp.id.toString()
const getY = (xp: Schemas["Experience"]) => xp.amount + 4

export type BarsProps = {
  width: number
  height: number
}

let tooltipTimeout: number
export const ActivityChart = ({ width, height }: BarsProps) => {
  const { data: rawData } = useExperiences({ count: false })
  if (!rawData) return <Skeleton style={{ width, height }} />
  const groupedData = new Map<number, Schemas["Experience"][]>()
  for (const xp of rawData) {
    const createdAt = new Date(xp.createdAt)
    const commonDay = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate()
    ).valueOf()
    groupedData.set(commonDay, [...(groupedData.get(commonDay) ?? []), xp])
  }
  const data = [...groupedData.entries()]
    .reduce<Schemas["Experience"][]>((acc, [_, xpGroup]) => {
      return [
        ...acc,
        {
          ...xpGroup[0],
          amount: xpGroup.reduce((sumAcc, xp) => sumAcc + xp.amount, 0),
        },
      ]
    }, [])
    .sort(
      (a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
    )

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

  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  })

  return width < 10 ? null : (
    <div className="relative">
      <svg width={width} height={height} ref={containerRef}>
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
                onMouseLeave={() => {
                  tooltipTimeout = window.setTimeout(() => {
                    hideTooltip()
                  }, 300)
                }}
                onMouseMove={(event) => {
                  if (tooltipTimeout) clearTimeout(tooltipTimeout)
                  const eventSvgCoords = localPoint(event)
                  const left = (barX || 0) + barWidth / 2
                  showTooltip({
                    tooltipData: xp,
                    tooltipTop: eventSvgCoords?.y,
                    tooltipLeft: left,
                  })
                }}
              />
            )
          })}
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          unstyled
          applyPositionStyle
          className="rounded border bg-card px-2 py-1"
        >
          <strong>+{tooltipData.amount} XP</strong>
          <div className="text-muted-foreground text-sm">
            {new Date(tooltipData.createdAt).toLocaleDateString()}
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}
