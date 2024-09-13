import { cn } from "@/lib/utils"
import { CircleWavyCheck } from "@phosphor-icons/react/dist/ssr"
import { ComponentProps } from "react"

export const CheckMark = ({
  className,
  ...props
}: ComponentProps<typeof CircleWavyCheck>) => {
  return (
    <CircleWavyCheck
      weight="fill"
      className={cn("size-5 fill-blue-500", className)}
      {...props}
    >
      <circle cx="128" cy="128" r="80" fill="white" />
    </CircleWavyCheck>
  )
}
