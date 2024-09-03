import FarcasterImage from "@/../static/socialIcons/farcaster.svg"
import { AvatarGroup } from "@/components/ui/AvatarGroup"
import { Separator } from "@/components/ui/Separator"
import { cn } from "@/lib/utils"
import { FarcasterProfile } from "@guildxyz/types"
import useUser from "components/[guild]/hooks/useUser"
import { PropsWithChildren } from "react"
import useSWRImmutable from "swr/immutable"
import { useProfile } from "../_hooks/useProfile"
import { useReferredUsers } from "../_hooks/useReferredUsers"

export const ProfileSocialCounters = ({ className }: any) => {
  const { data: referredUsers } = useReferredUsers()
  const { targetProfileData, relevantFollowers } = useProfileFarcaster()

  if (!referredUsers) return

  const targetFc = targetProfileData.data?.users.at(0)
  const relevantFc = relevantFollowers.data?.top_relevant_followers_hydrated?.map(
    ({ user }) => user
  )

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-6 gap-y-4 sm:flex-nowrap",
        className
      )}
    >
      <SocialCountTile count={referredUsers.length}>Guildmates</SocialCountTile>
      {targetFc && (
        <>
          <Separator orientation="vertical" className="h-10 md:h-12" />
          <SocialCountTile count={targetFc.following_count}>
            <FarcasterImage />
            Following
          </SocialCountTile>

          <Separator
            orientation="horizontal"
            className="h-px w-full sm:h-10 sm:w-px md:h-12"
          />
          {relevantFc ? (
            <RelevantFollowers {...{ relevantFc, targetFc }} />
          ) : (
            <SocialCountTile count={targetFc.follower_count}>
              <FarcasterImage />
              Followers
            </SocialCountTile>
          )}
        </>
      )}
    </div>
  )
}

/**
 * Uses [neynar API](https://docs.neynar.com) to retrieve farcaster data required by guild profile.
 * In the context of this function `target` is the *guild profile* that is observed, and `viewer` is the *guild user*
 * that is observing.
 *
 * @returns
 *
 * `targetProfileData`: `target` farcaster profile related data.
 *
 * `relevantFollowers`: farcaster followers that `target` and `viewer` share
 * from the context of the `viewer`.
 *
 * Reference:
 * - https://docs.neynar.com/reference/user-bulk
 * - https://docs.neynar.com/reference/relevant-followers
 * */
const useProfileFarcaster = () => {
  const { data: profile } = useProfile()
  const user = useUser()
  const viewerFcProfile = user.farcasterProfiles?.at(0)
  const targetFcProfile = useSWRImmutable<FarcasterProfile[]>(
    profile?.userId ? `/v2/users/${profile.userId}/farcaster-profiles` : null
  ).data?.at(0)
  const targetProfileData = useSWRImmutable(
    targetFcProfile
      ? `https://api.neynar.com/v2/farcaster/user/bulk?api_key=NEYNAR_API_DOCS&fids=${targetFcProfile.fid}`
      : null
  )
  const relevantFollowers = useSWRImmutable(
    targetFcProfile && viewerFcProfile
      ? `https://api.neynar.com/v2/farcaster/followers/relevant?api_key=NEYNAR_API_DOCS&target_fid=${targetFcProfile.fid}&viewer_fid=${viewerFcProfile.fid}`
      : null
  )
  return { targetProfileData, relevantFollowers }
}

const SocialCountTile = ({ count, children }: PropsWithChildren<{ count: any }>) => (
  <div className="flex flex-col items-center leading-tight">
    <div className="font-bold md:text-lg">{count}</div>
    <div className="flex items-center gap-1 text-muted-foreground">{children}</div>
  </div>
)

const RelevantFollowers = ({
  relevantFc,
  targetFc,
}: { relevantFc: any; targetFc: any }) => {
  const [firstFc, secondFc] = relevantFc
  return (
    <div className="flex items-center gap-2">
      <AvatarGroup
        imageUrls={relevantFc.map(({ pfp_url }) => pfp_url)}
        count={targetFc.follower_count}
      />
      <div className="max-w-64 text-muted-foreground leading-tight">
        Followed by <span className="font-bold">{firstFc.display_name}</span>
        {secondFc && (
          <>
            <span>", "</span>
            <span className="font-bold">{secondFc.display_name}</span>
          </>
        )}{" "}
        and {targetFc.follower_count - Math.min(2, relevantFc.length)} others on
        Farcaster
      </div>
    </div>
  )
}
