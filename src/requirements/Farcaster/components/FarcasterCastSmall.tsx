import { Skeleton } from "@/components/ui/Skeleton"
import {
  Chat,
  Heart,
  ShareNetwork,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr"
import { DataBlock } from "components/common/DataBlock"
import { useFarcasterCast } from "../hooks/useFarcasterCast"

export const FarcasterCastSmall = ({
  cast,
  loading,
  error,
}: {
  cast: ReturnType<typeof useFarcasterCast>["data"]
  loading: boolean
  error: boolean
}) => {
  const url = `https://warpcast.com/${cast?.author.username}/${cast?.hash}`

  if (loading) return <Skeleton className="inline-block h-5 w-32" />
  if (error)
    return (
      <DataBlock>
        <div className="inline-flex items-center gap-1">
          <WarningCircle weight="bold" />
          <span>Failed to load cast!</span>
        </div>
      </DataBlock>
    )

  if (!!cast && !loading && !error)
    return (
      <a href={url} target="_blank" className="group">
        <div className="inline-flex items-center gap-2 rounded-md border-border bg-blackAlpha-soft px-1.5 py-0.5 text-sm group-hover:border-b group-focus-visible:border-b dark:bg-blackAlpha">
          <div className="flex items-center gap-0.5">
            <img
              className="size-3 rounded-full object-cover"
              src={cast.author.pfp_url}
              alt={"Profile picture"}
            />
            <span className="font-bold text-xs">
              {cast.author.display_name ?? cast.author.username}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Heart weight="fill" className="size-2.5" />
              <span className="font-bold text-xs">{cast.reactions.likes_count}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <ShareNetwork weight="fill" className="size-2.5" />
              <span className="font-bold text-xs">
                {cast.reactions.recasts_count}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <Chat weight="fill" className="size-2.5" />
              <span className="font-bold text-xs">{cast.replies.count}</span>
            </div>
          </div>
        </div>
      </a>
    )

  return <Skeleton className="h-5 w-32" />
}
