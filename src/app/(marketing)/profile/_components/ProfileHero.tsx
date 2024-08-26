"use client"

import { CheckMark } from "@/components/CheckMark"
import { LayoutContainer } from "@/components/Layout"
import { ProfileAvatar } from "@/components/ProfileAvatar"
import { Avatar } from "@/components/ui/Avatar"
import { AvatarGroup } from "@/components/ui/AvatarGroup"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Separator"
import { Pencil } from "@phosphor-icons/react"
import { ProfileOwnerGuard } from "../_components/ProfileOwnerGuard"
import { useProfile } from "../_hooks/useProfile"
import { useReferredUsers } from "../_hooks/useReferredUsers"
import { EditProfile } from "./EditProfile/EditProfile"
import { ProfileHeroSkeleton } from "./ProfileSkeleton"

export const ProfileHero = () => {
  const { data: profile } = useProfile()
  const { data: referredUsers } = useReferredUsers()

  if (!profile || !referredUsers) return <ProfileHeroSkeleton />

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
        <Avatar className="relative mb-6 flex size-40 items-center justify-center rounded-full border-2 md:size-48">
          <ProfileAvatar
            username={profile.username}
            profileImageUrl={profile.profileImageUrl}
            size={192}
          />
        </Avatar>
        <h1 className="break-all text-center font-extrabold text-3xl leading-tight tracking-tight md:text-4xl">
          {profile.name || profile.username}
          <CheckMark className="ml-2 inline size-6 fill-yellow-500 align-baseline" />
        </h1>
        <div className="font-medium text-muted-foreground">@{profile.username}</div>
        <p className="mt-4 max-w-md text-pretty text-center text-lg text-muted-foreground md:mt-6">
          {profile.bio}
        </p>
        <div className="mt-8 grid grid-cols-[repeat(3,auto)] gap-x-6 gap-y-4 sm:grid-cols-[repeat(5,auto)]">
          <div className="flex flex-col items-center leading-tight">
            <div className="font-bold md:text-lg">{referredUsers.length}</div>
            <div className="text-muted-foreground">Guildmates</div>
          </div>
          <Separator orientation="vertical" className="h-10 md:h-12" />
          <div className="flex flex-col items-center leading-tight">
            <div className="font-bold md:text-lg">0</div>
            <div className="text-muted-foreground">Followers</div>
          </div>
          <Separator orientation="vertical" className="hidden h-12 sm:block" />
          <div className="col-span-3 flex items-center gap-2 place-self-center sm:col-span-1">
            <AvatarGroup imageUrls={["", ""]} count={8} />
            <div className="text-muted-foreground leading-tight">
              Followed by <span className="font-bold">Hoho</span>,<br />
              <span className="font-bold">Hihi</span> and 22 others
            </div>
          </div>
        </div>
      </div>
    </LayoutContainer>
  )
}
