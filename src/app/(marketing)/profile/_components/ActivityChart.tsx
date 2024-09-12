import { Skeleton } from "@/components/ui/Skeleton"
import { Schemas } from "@guildxyz/types"
import { localPoint } from "@visx/event"
import { Group } from "@visx/group"
import ParentSize from "@visx/responsive/lib/components/ParentSize"
import { scaleBand, scaleLinear } from "@visx/scale"
import { Bar } from "@visx/shape"
import { useTooltip, useTooltipInPortal } from "@visx/tooltip"
import { useMemo } from "react"
import { useExperienceProgression } from "../_hooks/useExperienceProgression"
import { useExperiences } from "../_hooks/useExperiences"

type TooltipData = Schemas["Experience"]
const verticalMargin = 0

const getX = (xp: Schemas["Experience"]) => xp.id.toString()
const getY = (xp: Schemas["Experience"]) => xp.amount

export type BarsProps = {
  width: number
  height: number
}

let tooltipTimeout: number

const ActivityChartChildren = ({
  width,
  height,
  rawData,
}: BarsProps & {
  rawData: Schemas["Experience"][]
}) => {
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
  const xp = useExperienceProgression()
  const groupedData = new Map<number, Schemas["Experience"][]>()
  for (const rawXp of rawData) {
    const createdAt = new Date(rawXp.createdAt)
    const commonDay = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate()
    ).valueOf()
    groupedData.set(commonDay, [...(groupedData.get(commonDay) ?? []), rawXp])
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
        range: [0, Math.min(data.length * 18, xMax)],
        round: true,
        domain: data.map(getX),
        padding: 0,
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
    <div className="relative">
      <svg width={width} height={height} ref={containerRef}>
        <Group top={verticalMargin / 2}>
          {data.map((currentXp) => {
            const x = getX(currentXp)
            const barWidth = xScale.bandwidth()
            const barHeight = yMax - (yScale(getY(currentXp)) ?? 0)
            const barX = xScale(x)
            const barY = yMax - barHeight
            return (
              <g key={currentXp.id}>
                <rect
                  x={barX}
                  y={0}
                  width={barWidth}
                  height={yMax}
                  fill="transparent"
                  className="cursor-pointer px-0.5 hover:fill-card-foreground/10"
                  onMouseLeave={() => {
                    tooltipTimeout = window.setTimeout(() => {
                      hideTooltip()
                    }, 120)
                  }}
                  onMouseMove={(event) => {
                    if (tooltipTimeout) clearTimeout(tooltipTimeout)
                    const eventSvgCoords = localPoint(event)
                    const left = (barX || 0) + barWidth / 2
                    showTooltip({
                      tooltipData: currentXp,
                      tooltipTop: eventSvgCoords?.y,
                      tooltipLeft: left,
                    })
                  }}
                />
                <Bar
                  className="pointer-events-none"
                  ry={4}
                  x={barX && barX + 2}
                  y={barY}
                  width={barWidth - 4}
                  height={barHeight}
                  fill={xp?.rank.color}
                />
              </g>
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
          className="rounded border bg-card px-2 py-1 text-sm"
        >
          <strong>+{tooltipData.amount} XP</strong>
          <div className="text-muted-foreground">
            {new Date(tooltipData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}

export const ActivityChart = () => {
  const { data: rawData } = useExperiences({ count: false })

  if (!rawData) return <Skeleton className="h-7 w-full" />

  if (rawData.length === 0)
    return <p className="text-muted-foreground">There's no activity this month</p>

  return (
    <div className="h-7">
      <ParentSize>
        {({ width, height }) => (
          <ActivityChartChildren height={height} width={width} rawData={rawData} />
        )}
      </ParentSize>
    </div>
  )
}
