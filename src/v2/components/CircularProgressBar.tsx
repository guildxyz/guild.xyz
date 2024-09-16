import { cn } from "@/lib/utils"
import React from "react"

interface CircularProgressBarProps {
  strokeWidth?: number
  progress: number
  color?: string
  bgColor?: string
  className?: string
}

export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  strokeWidth = 6,
  progress,
  color,
  bgColor,
  className,
}) => {
  const size = 128
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - progress * circumference

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      <circle
        className={cn({
          "stroke-background dark:stroke-[var(--blackAlpha-300)]": !bgColor,
        })}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={bgColor}
        strokeWidth={strokeWidth}
      />
      <circle
        className={cn("transition ease-out", {
          "stroke-primary": !color,
        })}
        style={{
          transitionDuration: "3.33s",
          transitionProperty: "stroke-dashoffset",
        }}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset || 0}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}
