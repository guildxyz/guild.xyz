"use client"

import { CheckMark } from "@/components/CheckMark"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { AvatarGroup } from "@/components/ui/AvatarGroup"
import { Card } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Separator"
import { Skeleton } from "@/components/ui/Skeleton"
import { cn } from "@/lib/utils"
import { Info } from "@phosphor-icons/react"
import { PropsWithChildren } from "react"
import { ContributionCard } from "../_components/ContributionCard"
import { EditContributions } from "../_components/EditContributions"
import { ProfileOwnerGuard } from "../_components/ProfileOwnerGuard"
import { RecentActivity } from "../_components/RecentActivity"
import { useContributions } from "../_hooks/useContributions"
import { useProfile } from "../_hooks/useProfile"
import { useReferredUsers } from "../_hooks/useReferredUsers"
import { EditProfile } from "./EditProfile/EditProfile"
import { ProfileSkeleton } from "./ProfileSkeleton"

export const Profile = () => {
  const { data: profile } = useProfile()
  const { data: contributions } = useContributions()
  const { data: referredUsers } = useReferredUsers()

  if (!profile || !contributions || !referredUsers) return <ProfileSkeleton />

  return (
    <>
      <div className="relative mb-12 flex flex-col items-center pt-12 md:mb-20 md:pt-14">
        <ProfileOwnerGuard>
          <EditProfile />
        </ProfileOwnerGuard>
        <div className="relative mb-6 flex items-center justify-center">
          <Avatar className="size-40 md:size-48">
            <AvatarImage
              src={profile.profileImageUrl ?? ""}
              alt="profile"
              width={192}
              height={192}
            />
            <AvatarFallback>
              <Skeleton className="size-full" />
            </AvatarFallback>
          </Avatar>
        </div>
        <h1 className="break-all text-center font-extrabold text-3xl leading-tight tracking-tight md:text-4xl">
          {profile.name}
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
      <div className="mb-3 flex items-center justify-between">
        <SectionTitle>Top contributions</SectionTitle>
        <ProfileOwnerGuard>
          <EditContributions />
        </ProfileOwnerGuard>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {contributions.length === 0 && (
          <Card className="flex gap-2 border border-info p-4">
            <Info weight="fill" size={32} className="text-info" />
            <div>
              <h3 className="mb-1 font-bold text-md">
                Contributions will appear here
              </h3>
              <p className="text-muted-foreground">
                This profile doesn't have any contribution yet
              </p>
            </div>
          </Card>
        )}
        {contributions.map((contribution) => (
          <ContributionCard contribution={contribution} key={contribution.id} />
        ))}
      </div>
      <div className="mt-8">
        <SectionTitle className="mb-3">Recent activity</SectionTitle>
        <RecentActivity />
        <p className="mt-2 font-semibold text-muted-foreground">
          &hellip; only last 20 actions are shown
        </p>
      </div>
    </>
  )
}

const SectionTitle = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => (
  <h2 className={cn("font-bold sm:text-lg", className)}>{children}</h2>
)
