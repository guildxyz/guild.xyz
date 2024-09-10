"use client"
import { Polygon } from "@/components/Polygon"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { Info } from "@phosphor-icons/react"
import { Progress, ProgressIndicator } from "@radix-ui/react-progress"
import ParentSize from "@visx/responsive/lib/components/ParentSize"
import { PropsWithChildren } from "react"
import { ContributionCard } from "../_components/ContributionCard"
import { EditContributions } from "../_components/EditContributions"
import { ProfileOwnerGuard } from "../_components/ProfileOwnerGuard"
import { useContributions } from "../_hooks/useContributions"
import { useExperienceProgression } from "../_hooks/useExperienceProgression"
import { useProfile } from "../_hooks/useProfile"
import { useReferredUsers } from "../_hooks/useReferredUsers"
import { ActivityChart } from "./ActivityChart"
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
      <div className="mb-16 flex flex-col gap-4">
        <SectionTitle>Experience</SectionTitle>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="flex gap-4 p-6">
            <Polygon
              color={xp.rank.color}
              sides={xp.rank.polygonCount}
              className="size-12"
            />
            {/*<LevelBadge
                level={level}
                className="row-span-3 size-14 self-start justify-self-center"
              />*/}
            <div className="flex w-full flex-col gap-2">
              <div className="flex flex-col justify-between gap-2 sm:flex-row">
                <h3 className="font-bold capitalize">{xp.rank.title}</h3>
                <p className="text-muted-foreground">
                  {`${xp.experienceCount} / ${Math.ceil(xp.level)} XP`}
                </p>
              </div>
              <Progress
                className={cn(
                  "relative h-3 w-full overflow-hidden rounded-full bg-secondary"
                )}
              >
                <ProgressIndicator
                  className="h-full w-full flex-1 rounded-r-full transition-all"
                  style={{
                    background: xp.rank.color,
                    transform: `translateX(-${(1 - (xp.progress || 0)) * 100}%)`,
                  }}
                />
              </Progress>
              <Progress value={xp.progress * 100} color={xp.rank.color} />
              {/*<p className="text-muted-foreground">
                This is a description that perfectly matches the 80 character
                description limit.
              </p>*/}
            </div>
          </Card>
          <Card className="space-y-4 p-6">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
              <h3 className="font-bold">Engagement this month</h3>
            </div>
            <ParentSize>
              {({ width }) => <ActivityChart width={width} height={32} />}
            </ParentSize>
          </Card>
        </div>
      </div>
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
      <div className="mt-16">
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
