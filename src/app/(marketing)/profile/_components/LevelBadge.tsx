import { cn } from "@/lib/utils"
import { MAX_LEVEL, RANKS } from "../[username]/constants"

type PolygonProps = {
  sides: number
  radius: number
  color: string
}

const Polygon = ({ sides, radius, color }: PolygonProps) => {
  const angleStep = (2 * Math.PI) / sides
  const points = Array.from({ length: sides }, (_, i) => {
    const x = 20 + radius * Math.cos(i * angleStep)
    const y = 20 + radius * Math.sin(i * angleStep)
    return `${x},${y}`
  }).join(" ")

  return (
    <svg width={100} height={100}>
      <polygon
        points={points}
        stroke={color}
        fill={color}
        strokeWidth="10"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type LevelBadgeProps = {
  level: number
  className?: string
}

export const LevelBadge = ({ level, className }: LevelBadgeProps) => {
  const rank =
    RANKS[Math.min(Math.floor((level / MAX_LEVEL) * RANKS.length), RANKS.length - 1)]

  return (
    <div
      className={cn("relative grid size-12 place-items-center shadow-lg", className)}
    >
      <div className="size-full rounded-full" style={{ background: rank.color }} />
      <div className="absolute select-none font-extrabold text-xl">{level}</div>
    </div>
  )
}
// <Polygon sides={5} radius={20} color={"hsl(var(--primary))"} />
