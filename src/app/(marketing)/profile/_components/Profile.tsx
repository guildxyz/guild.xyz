"use client"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"
import { ProgressIndicator, ProgressRoot } from "@/components/ui/Progress"
import { cn } from "@/lib/utils"
import { Info } from "@phosphor-icons/react"
import { PropsWithChildren } from "react"
import { ContributionCard } from "../_components/ContributionCard"
import { EditContributions } from "../_components/EditContributions"
import { ProfileOwnerGuard } from "../_components/ProfileOwnerGuard"
import { useContributions } from "../_hooks/useContributions"
import { useExperienceProgression } from "../_hooks/useExperienceProgression"
import { useProfile } from "../_hooks/useProfile"
import { useReferredUsers } from "../_hooks/useReferredUsers"
import { ActivityChart } from "./ActivityChart"
import { LevelBadge } from "./LevelBadge"
import { ProfileMainSkeleton } from "./ProfileSkeleton"
import { RecentActivity } from "./RecentActivity/RecentActivity"
import RecentActivityFallback from "./RecentActivity/RecentActivityFallback"

export const Profile = () => {
  const { data: profile } = useProfile()
  const { data: contributions } = useContributions()
  const { data: referredUsers } = useReferredUsers()
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const xp = useExperienceProgression()

  if (!profile || !contributions || !referredUsers || !xp)
    return <ProfileMainSkeleton />

  return (
    <>
      <div className="mb-12">
        <div data-theme="dark" className="mb-3">
          <SectionTitle>Experience</SectionTitle>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="flex items-center gap-4 p-6">
            <LevelBadge level={xp.level} rank={xp.rank} size="lg" className="" />
            <div className="-mt-1 flex grow flex-col gap-3">
              <div className="flex flex-col justify-between sm:flex-row">
                <h3 className="font-bold capitalize">{xp.rank.title}</h3>
                <Badge variant="outline">
                  {`${xp.currentLevelXp} -> `}
                  <span className="font-bold text-foreground">
                    {xp.experienceCount} XP
                  </span>
                  {` -> ${xp.nextLevelXp}`}
                </Badge>
              </div>
              <ProgressRoot>
                <ProgressIndicator
                  value={xp.progress}
                  style={{ background: xp.rank.color }}
                />
              </ProgressRoot>
            </div>
          </Card>
          <Card className="space-y-3 p-6 pt-5">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
              <h3 className="font-bold">Recent engagement</h3>
            </div>
            <ActivityChart />
          </Card>
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
        {contributions.slice(0, 3).map((contribution) => (
          <ContributionCard contribution={contribution} key={contribution.id} />
        ))}
      </div>
      <div className="mt-14">
        <SectionTitle className="mb-3">Recent activity</SectionTitle>
        {isWeb3Connected ? <RecentActivity /> : <RecentActivityFallback />}
      </div>
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
