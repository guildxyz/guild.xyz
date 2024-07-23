import { cn } from "@/lib/utils"
import { CircleWavyCheck } from "@phosphor-icons/react/dist/ssr"

export const CheckMark = ({ className }: { className?: string }) => {
  return (
    <CircleWavyCheck weight="fill" className={cn("size-5 fill-blue-500", className)}>
      <circle cx="128" cy="128" r="80" fill="white" />
    </CircleWavyCheck>
  )
}
