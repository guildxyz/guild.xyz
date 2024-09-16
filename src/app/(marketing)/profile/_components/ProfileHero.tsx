"use client"

import { CheckMark } from "@/components/CheckMark"
import { CircularProgressBar } from "@/components/CircularProgressBar"
import { LayoutContainer } from "@/components/Layout"
import { ProfileAvatar } from "@/components/ProfileAvatar"
import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pencil } from "@phosphor-icons/react"
import { ProfileOwnerGuard } from "../_components/ProfileOwnerGuard"
import { useExperienceProgression } from "../_hooks/useExperienceProgression"
import { useProfile } from "../_hooks/useProfile"
import { EditProfile } from "./EditProfile/EditProfile"
import { LevelBadge } from "./LevelBadge"
import { ProfileHeroSkeleton } from "./ProfileSkeleton"
import { ProfileSocialCounters } from "./ProfileSocialCounters"

export const ProfileHero = () => {
  const { data: profile } = useProfile()
  const xp = useExperienceProgression()

  if (!profile || !xp) return <ProfileHeroSkeleton />
  const { rank, level, progress } = xp

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
        <div className="relative mb-6 flex size-44 items-center justify-center md:size-56">
          <CircularProgressBar
            progress={progress}
            color={rank.color}
            strokeWidth={5}
            className="absolute inset-0 size-full"
          />
          <Avatar className="flex size-40 items-center justify-center rounded-full border md:size-48">
            <ProfileAvatar
              username={profile.username}
              profileImageUrl={profile.profileImageUrl}
            />
          </Avatar>
          <LevelBadge
            size="lg"
            level={level}
            rank={rank}
            className="absolute right-2 bottom-2 md:right-3 md:bottom-3"
          />
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
