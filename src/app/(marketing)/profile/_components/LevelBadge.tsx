import { Polygon } from "@/components/Polygon"
import { VariantProps, cva } from "class-variance-authority"
import { Rank } from "../[username]/types"

const levelBadgeVariants = cva("flex items-center justify-center", {
  variants: {
    size: {
      md: "size-7 text-xs",
      lg: "text-lg md:text-xl size-10 md:size-12",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

type LevelBadgeProps = {
  level: number
  rank: Rank
  className?: string
} & VariantProps<typeof levelBadgeVariants>

export const LevelBadge = ({ rank, level, size, className }: LevelBadgeProps) => {
  return (
    <div className={levelBadgeVariants({ size, className })}>
      <Polygon
        sides={rank.polygonCount}
        color={rank.color}
        className="brightness-75"
      />
      <span className="-mt-0.5 absolute font-bold font-display text-white">
        {level}
      </span>
    </div>
  )
}
