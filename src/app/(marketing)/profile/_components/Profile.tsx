"use client"
import {} from "@/components/ui/Avatar"
import { Card } from "@/components/ui/Card"
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
import { ProfileHero } from "./ProfileHero"
import { ProfileSkeleton } from "./ProfileSkeleton"

export const Profile = () => {
  const { data: profile } = useProfile()
  const { data: contributions } = useContributions()
  const { data: referredUsers } = useReferredUsers()

  if (!profile || !contributions || !referredUsers) return <ProfileSkeleton />

  return (
    <>
      <ProfileHero />
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
