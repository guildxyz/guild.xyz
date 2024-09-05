import FarcasterImage from "@/../static/socialIcons/farcaster.svg"
import { AvatarGroup } from "@/components/ui/AvatarGroup"
import { Separator } from "@/components/ui/Separator"
import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"
import { RequiredFields } from "types"
import {
  User,
  useFarcasterProfile,
  useRelevantFarcasterFollowers,
} from "../_hooks/useFarcasterProfile"
import { useProfile } from "../_hooks/useProfile"
import { useReferredUsers } from "../_hooks/useReferredUsers"

type DisplayableUser = RequiredFields<User, "pfp_url" | "display_name">

export const ProfileSocialCounters = ({ className }: any) => {
  const { data: referredUsers } = useReferredUsers()
  const { data: profile } = useProfile()
  const { farcasterProfile } = useFarcasterProfile(profile?.userId)
  const { relevantFollowers } = useRelevantFarcasterFollowers(farcasterProfile?.fid)
  const relevantFollowersFiltered = relevantFollowers?.filter(
    (user) => user && user.pfp_url && user.display_name
  ) as undefined | DisplayableUser[]

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-6 gap-y-4 sm:flex-nowrap",
        className
      )}
    >
      {referredUsers && (
        <SocialCountTile count={referredUsers.length}>Guildmates</SocialCountTile>
      )}
      {farcasterProfile && (
        <>
          <Separator orientation="vertical" className="h-10 md:h-12" />
          <SocialCountTile count={farcasterProfile.following_count}>
            <FarcasterImage />
            Following
          </SocialCountTile>

          <Separator orientation="vertical" className="h-10 max-sm:hidden md:h-12" />
          {relevantFollowersFiltered && relevantFollowersFiltered.length >= 1 ? (
            <RelevantFollowers
              relevantFollowers={relevantFollowersFiltered}
              followerCount={farcasterProfile.follower_count}
            />
          ) : (
            <SocialCountTile count={farcasterProfile.follower_count}>
              <FarcasterImage />
              Followers
            </SocialCountTile>
          )}
        </>
      )}
    </div>
  )
}

const SocialCountTile = ({
  count,
  children,
}: PropsWithChildren<{ count: number }>) => (
  <div className="flex flex-col items-center leading-tight">
    <div className="font-bold md:text-lg">{count}</div>
    <div className="flex items-center gap-1 text-muted-foreground">{children}</div>
  </div>
)

const RelevantFollowers = ({
  relevantFollowers,
  followerCount,
}: {
  relevantFollowers: DisplayableUser[]
  followerCount: number
}) => {
  if (!relevantFollowers.length) {
    throw new Error(
      "Relevant followers must have at least one farcaster profile to display"
    )
  }
  const [firstFc, secondFc] = relevantFollowers

  return (
    <div className="flex items-center gap-2">
      <AvatarGroup
        imageUrls={relevantFollowers.slice(0, 3).map(({ pfp_url }) => pfp_url)}
        count={followerCount}
      />
      <div className="max-w-64 text-muted-foreground leading-tight">
        Followed by <span className="font-bold">{firstFc.display_name}</span>
        {secondFc && (
          <>
            <span>", "</span>
            <span className="font-bold">{secondFc.display_name}</span>
          </>
        )}{" "}
        and {followerCount - Math.min(2, relevantFollowers.length)} others on
        Farcaster
      </div>
    </div>
  )
}
