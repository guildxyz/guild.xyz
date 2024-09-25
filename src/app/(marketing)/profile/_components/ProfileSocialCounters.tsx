import FarcasterImage from "@/../static/socialIcons/farcaster.svg"
import { CopyLink } from "@/components/CopyLink"
import { ProfileAvatar } from "@/components/ProfileAvatar"
import { Anchor } from "@/components/ui/Anchor"
import { Avatar } from "@/components/ui/Avatar"
import { AvatarGroup } from "@/components/ui/AvatarGroup"
import { Card } from "@/components/ui/Card"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { ScrollArea } from "@/components/ui/ScrollArea"
import { Separator } from "@/components/ui/Separator"
import { Skeleton } from "@/components/ui/Skeleton"
import { cn } from "@/lib/utils"
import { REFERRER_USER_SEARCH_PARAM_KEY } from "@app/(marketing)/create-profile/(onboarding)/constants"
import { EnvelopeOpen } from "@phosphor-icons/react"
import { PropsWithChildren } from "react"
import { RequiredFields } from "types"
import pluralize from "utils/pluralize"
import {
  User,
  useFarcasterProfile,
  useRelevantFarcasterFollowers,
} from "../_hooks/useFarcasterProfile"
import { useProfile } from "../_hooks/useProfile"
import { useReferredUsers } from "../_hooks/useReferredUsers"
import { ProfileOwnerGuard } from "./ProfileOwnerGuard"

type DisplayableUser = RequiredFields<User, "pfp_url" | "display_name">

export const ProfileSocialCounters = ({ className }: any) => {
  const { data: referredUsers } = useReferredUsers()
  const { data: profile } = useProfile()
  const { farcasterProfile } = useFarcasterProfile(profile?.userId)
  const { relevantFollowers } = useRelevantFarcasterFollowers(farcasterProfile?.fid)
  const relevantFollowersFiltered = relevantFollowers?.filter(
    (user) => user && user.pfp_url && user.display_name
  ) as undefined | DisplayableUser[]
  const inviteLink =
    profile &&
    `https://guild.xyz/create-profile/prompt-referrer?${REFERRER_USER_SEARCH_PARAM_KEY}=${profile.username}`

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-6 gap-y-4 sm:flex-nowrap",
        className
      )}
    >
      {referredUsers ? (
        <Dialog>
          <DialogTrigger className="group">
            <SocialCountTile count={referredUsers.length}>
              <div className="underline decoration-dotted underline-offset-4 transition-colors group-hover:text-foreground">
                Guildmates
              </div>
            </SocialCountTile>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Guildmates</DialogTitle>
              <DialogDescription>
                Profiles created using this referral
              </DialogDescription>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody>
              <ProfileOwnerGuard>
                {inviteLink && (
                  <Card className="mb-8 space-y-4 border border-info bg-card-secondary p-4">
                    <div className="flex items-center gap-3">
                      <EnvelopeOpen className="size-8 text-info" weight="fill" />
                      <p className="flex-1 text-pretty font-medium">
                        Share this link with friends and earn XP by gathering
                        Guildmates!
                      </p>
                    </div>
                    <CopyLink href={inviteLink} />
                  </Card>
                )}
              </ProfileOwnerGuard>
              <ScrollArea className="h-96">
                {referredUsers.length ? (
                  referredUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center gap-2 pb-3.5"
                    >
                      <Avatar className="border">
                        <ProfileAvatar
                          username={user.username}
                          profileImageUrl={user.profileImageUrl}
                        />
                      </Avatar>
                      <div className="leading-tight">
                        <div className="max-w-64 truncate">
                          {user.name || user.username}
                        </div>
                        <Anchor
                          href={`/profile/${user.username}`}
                          variant="muted"
                          target="_blank"
                          className="text-sm"
                        >
                          @{user.username}
                        </Anchor>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    This profile has no guildmates to show yet.
                  </p>
                )}
              </ScrollArea>
            </DialogBody>
          </DialogContent>
        </Dialog>
      ) : (
        <Skeleton className="h-12 w-20" />
      )}
      {farcasterProfile && (
        <>
          <Separator orientation="vertical" className="h-10 md:h-12" />
          <SocialCountTile count={farcasterProfile.follower_count}>
            <FarcasterImage />
            Followers
          </SocialCountTile>

          {relevantFollowersFiltered && relevantFollowersFiltered.length >= 1 && (
            <>
              <Separator
                orientation="vertical"
                className="h-10 max-sm:hidden md:h-12"
              />
              <RelevantFollowers relevantFollowers={relevantFollowersFiltered} />
            </>
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
}: {
  relevantFollowers: DisplayableUser[]
}) => {
  if (!relevantFollowers.length) {
    throw new Error(
      "Relevant followers must have at least one farcaster profile to display"
    )
  }
  const [firstFc, secondFc] = relevantFollowers
  const remainingFollowers =
    relevantFollowers.length - Math.min(2, relevantFollowers.length)

  return (
    <div className="flex items-center gap-2">
      <AvatarGroup
        imageUrls={relevantFollowers.slice(0, 3).map(({ pfp_url }) => pfp_url)}
        count={relevantFollowers.length}
      />
      <div
        className={cn("max-w-72 text-balance text-muted-foreground leading-tight", {
          "max-w-64": !secondFc,
        })}
      >
        Followed by{" "}
        <span className="inline-block max-w-24 truncate align-bottom font-bold">
          {firstFc.display_name}
          {secondFc && <span className="font-normal">,&nbsp;</span>}
        </span>
        {secondFc && (
          <span className="inline-block max-w-24 truncate align-bottom font-bold">
            {secondFc.display_name}
          </span>
        )}
        {!!remainingFollowers && ` and ${pluralize(remainingFollowers, "other")}`} on
        Farcaster
      </div>
    </div>
  )
}
