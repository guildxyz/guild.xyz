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
  const profileFarcaster = useProfileFarcaster()

  const fc = profileFarcaster.followers.data?.users.at(0)
  const relevantFc =
    profileFarcaster.relevantFollowers.data?.top_relevant_followers_hydrated?.map(
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
      {fc && (
        <>
          <Separator orientation="vertical" className="h-10 md:h-12" />
          <SocialCountTile count={fc.following_count}>
            <FarcasterImage />
            Following
          </SocialCountTile>

          <Separator
            orientation="horizontal"
            className="h-px w-full sm:h-10 sm:w-px md:h-12"
          />
          {relevantFc ? (
            <RelevantFollowers {...{ relevantFc, fc }} />
          ) : (
            <SocialCountTile count={fc.follower_count}>
              <FarcasterImage />
              Followers
            </SocialCountTile>
          )}
        </>
      )}
    </div>
  )
}

const useProfileFarcaster = () => {
  const { data: profile } = useProfile()
  const user = useUser(profile?.userId)
  const userFcProfile = user.farcasterProfiles?.at(0)
  const fcProfile = useSWRImmutable<FarcasterProfile[]>(
    profile?.userId ? `/v2/users/${profile.userId}/farcaster-profiles` : null
  ).data?.at(0)
  const followers = useSWRImmutable(
    fcProfile
      ? `https://api.neynar.com/v2/farcaster/user/bulk?api_key=NEYNAR_API_DOCS&fids=${fcProfile.fid}`
      : null
  )
  const relevantFollowers = useSWRImmutable(
    fcProfile && userFcProfile
      ? `https://api.neynar.com/v2/farcaster/followers/relevant?api_key=NEYNAR_API_DOCS&target_fid=${fcProfile.fid}&viewer_fid=${userFcProfile.fid}`
      : null
  )
  return { followers, relevantFollowers }
}

const SocialCountTile = ({ count, children }: PropsWithChildren<{ count: any }>) => (
  <div className="flex flex-col items-center leading-tight">
    <div className="font-bold md:text-lg">{count}</div>
    <div className="flex items-center gap-1 text-muted-foreground">{children}</div>
  </div>
)

const RelevantFollowers = ({ relevantFc, fc }: { relevantFc: any; fc: any }) => {
  const [first, second] = relevantFc
  return (
    <div className="flex items-center gap-2">
      <AvatarGroup
        imageUrls={relevantFc.map(({ pfp_url }) => pfp_url)}
        count={fc.follower_count}
      />
      <div className="max-w-64 text-muted-foreground leading-tight">
        Followed by <span className="font-bold">{first.display_name}</span>
        {second && (
          <>
            <span>", "</span>
            <span className="font-bold">{second.display_name}</span>
          </>
        )}{" "}
        and {fc.follower_count - Math.min(2, relevantFc.length)} others on Farcaster
      </div>
    </div>
  )
}
