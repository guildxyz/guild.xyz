"use client"
import { CheckMark } from "@/components/CheckMark"
import { LayoutContainer } from "@/components/Layout"
import { ProfileAvatar } from "@/components/ProfileAvatar"
import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pencil } from "@phosphor-icons/react"
import { RANKS } from "../[username]/constants"
import { ProfileOwnerGuard } from "../_components/ProfileOwnerGuard"
import { useExperiences } from "../_hooks/useExperiences"
import { useProfile } from "../_hooks/useProfile"
import { CircularProgressBar } from "./CircularProgressBar"
import { EditProfile } from "./EditProfile/EditProfile"
import { Polygon } from "./Polygon"
import { ProfileHeroSkeleton } from "./ProfileSkeleton"
import { ProfileSocialCounters } from "./ProfileSocialCounters"

export const ProfileHero = () => {
  const { data: profile } = useProfile()
  const { data: experienceCount } = useExperiences({ count: true })
  const rankIndex = RANKS.findIndex(
    ({ requiredXp }) => experienceCount >= requiredXp
  )
  const [rank, nextRank] = RANKS.slice(rankIndex, rankIndex + 1) as [
    (typeof RANKS)[number],
    (typeof RANKS)[number] | undefined,
  ]

  if (!profile || !rank) return <ProfileHeroSkeleton />

  return (
    <LayoutContainer>
      <div
        className="relative flex flex-col items-center py-10 text-foreground md:py-20"
        data-theme="dark"
      >
        <ProfileOwnerGuard>
          <EditProfile>
            <Card className="absolute top-3 right-0 rounded-xl md:top-8">
              <Button
                variant="solid"
                className="max-sm:h-8 max-sm:px-3 max-sm:text-sm"
              >
                <Pencil weight="bold" />
                Edit profile
              </Button>
            </Card>
          </EditProfile>
        </ProfileOwnerGuard>
        <div className="relative mb-6 flex size-48 items-center justify-center md:size-56">
          <CircularProgressBar
            progress={nextRank ? experienceCount / nextRank.requiredXp : 1}
            color={rank.color}
            className="absolute inset-0 size-full"
          />
          <Avatar className="flex size-40 items-center justify-center rounded-full border-2 md:size-48">
            <ProfileAvatar
              username={profile.username}
              profileImageUrl={profile.profileImageUrl}
            />
          </Avatar>
          <div className="-translate-x-1/4 -translate-y-1/4 absolute right-0 bottom-0 flex size-12 items-center justify-center">
            <Polygon
              sides={rank.polygonCount}
              color={rank.color}
              className="brightness-75"
            />
            <span className="absolute font-bold font-display text-xl">23</span>
          </div>
        </div>
        <h1 className="break-all text-center font-extrabold text-3xl leading-tight tracking-tight md:text-4xl">
          {profile.name || profile.username}
          <CheckMark className="ml-2 inline size-6 fill-yellow-500 align-baseline" />
        </h1>
        <div className="font-medium text-muted-foreground">@{profile.username}</div>
        <p className="mt-4 max-w-md text-pretty text-center text-lg text-muted-foreground md:mt-6">
          {profile.bio}
        </p>
        <ProfileSocialCounters className="mt-8" />
      </div>
    </LayoutContainer>
  )
}
