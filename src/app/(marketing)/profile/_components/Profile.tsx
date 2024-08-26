"use client"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { Info } from "@phosphor-icons/react"
import { PropsWithChildren } from "react"
import { ContributionCard } from "../_components/ContributionCard"
import { EditContributions } from "../_components/EditContributions"
import { ProfileOwnerGuard } from "../_components/ProfileOwnerGuard"
import { useContributions } from "../_hooks/useContributions"
import { useProfile } from "../_hooks/useProfile"
import { useReferredUsers } from "../_hooks/useReferredUsers"
import { ProfileMainSkeleton } from "./ProfileSkeleton"
import { RecentActivity } from "./RecentActivity/RecentActivity"

export const Profile = () => {
  const { data: profile } = useProfile()
  const { data: contributions } = useContributions()
  const { data: referredUsers } = useReferredUsers()
  const { isWeb3Connected } = useWeb3ConnectionManager()

  if (!profile || !contributions || !referredUsers) return <ProfileMainSkeleton />

  return (
    <>
      <div className="mb-3 flex items-center justify-between" data-theme="dark">
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
        {contributions.slice(0, 3).map((contribution) => (
          <ContributionCard contribution={contribution} key={contribution.id} />
        ))}
      </div>
      {isWeb3Connected && (
        <div className="mt-16">
          <SectionTitle className="mb-3">Recent activity</SectionTitle>
          <RecentActivity />
          <p className="mt-2 font-semibold text-muted-foreground">
            &hellip; only last 20 actions are shown
          </p>
        </div>
      )}
    </>
  )
}

const SectionTitle = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => (
  <h2 className={cn("font-bold text-foreground sm:text-lg", className)}>
    {children}
  </h2>
)
