import { cn } from "@/lib/utils"
import { Icon } from "@phosphor-icons/react/dist/lib/types"
import {
  ArrowSquareOut,
  Chat,
  CircleNotch,
  Heart,
  ShareNetwork,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr"
import { HTMLAttributes, PropsWithChildren } from "react"
import { useFarcasterCast } from "../hooks/useFarcasterCast"
import { FarcasterCastSmall } from "./FarcasterCastSmall"

export const FarcasterCast = ({
  cast,
  loading,
  error,
  size = "md",
}: {
  cast: ReturnType<typeof useFarcasterCast>["data"]
  loading: boolean
  error: boolean
  size?: string
}) => {
  const url = `https://warpcast.com/${cast?.author.username}/${cast?.hash}`
  const prettyDate =
    cast?.timestamp &&
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(cast.timestamp))

  if (size === "sm") {
    return <FarcasterCastSmall cast={cast} error={error} loading={loading} />
  }

  if (loading) {
    return (
      <CastWrapper className="gap-2">
        <CircleNotch weight="bold" className="size-6 animate-spin duration-1000" />
        <p className="text-sm">Loading cast...</p>
      </CastWrapper>
    )
  }

  if (error) {
    return (
      <CastWrapper className="gap-2">
        <WarningCircle weight="bold" className="text-warning-subtle-foreground" />
        <p className="text-sm">Failed to load cast!</p>
      </CastWrapper>
    )
  }

  if (!cast) {
    return (
      <CastWrapper>
        <p className="text-muted-foreground text-sm">No cast found</p>
      </CastWrapper>
    )
  }

  return (
    <a href={url} target="_blank">
      <CastWrapper className="gap-4">
        <div className="flex items-center gap-2">
          {cast.author.pfp_url && (
            <img
              className="size-7 rounded-full object-cover"
              src={cast.author.pfp_url}
              alt="Profile picture"
            />
          )}
          <div className="flex flex-col">
            <span className="text-ellipsis font-bold text-sm">
              {cast.author.display_name ?? cast.author.username}
            </span>
            <span className="text-muted-foreground text-xs">{prettyDate}</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Stat icon={Heart} value={cast.likes_count} />
          <Stat icon={ShareNetwork} value={cast.recasts_count} />
          <Stat icon={Chat} value={cast.replies_count} />
        </div>

        <ArrowSquareOut weight="bold" />
      </CastWrapper>
    </a>
  )
}

const Stat = ({
  icon: Icon,
  value,
}: {
  icon: Icon
  value: number
}) => (
  <div className="flex items-center gap-0.5">
    <Icon weight="fill" />
    <span className="font-bold text-xs">{value}</span>
  </div>
)

const CastWrapper = ({
  className,
  children,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div
    className={cn(
      "relative flex min-h-16 w-full items-center justify-center overflow-hidden rounded-xl border bg-blackAlpha-soft px-4 py-3.5 dark:bg-blackAlpha",
      className
    )}
  >
    {children}
  </div>
)
