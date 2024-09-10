import { Skeleton } from "@/components/ui/Skeleton"
import { Schemas } from "@guildxyz/types"
import { localPoint } from "@visx/event"
import { Group } from "@visx/group"
import { scaleBand, scaleLinear } from "@visx/scale"
import { Bar } from "@visx/shape"
import { defaultStyles, useTooltip, useTooltipInPortal } from "@visx/tooltip"
import { useMemo } from "react"
import { useExperiences } from "../_hooks/useExperiences"

type TooltipData = Schemas["Experience"]
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white",
}

const verticalMargin = 0

const getX = (xp: Schemas["Experience"]) => xp.id.toString()
const getY = (xp: Schemas["Experience"]) => xp.amount

export type BarsProps = {
  width: number
  height: number
}

let tooltipTimeout: number
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

  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // TooltipInPortal is rendered in a separate child of <body /> and positioned
    // with page coordinates which should be updated on scroll. consider using
    // Tooltip or TooltipWithBounds if you don't need to render inside a Portal
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
                  // TooltipInPortal expects coordinates to be relative to containerRef
                  // localPoint returns coordinates relative to the nearest SVG, which
                  // is what containerRef is set to in this example.
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
        <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div>
            <strong>+{tooltipData.amount} XP</strong>
          </div>
          <div>
            <small>{new Date(tooltipData.createdAt).toLocaleDateString()}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}
