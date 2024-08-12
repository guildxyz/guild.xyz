"use client"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import { useState } from "react"
import { useActivity } from "../_hooks/useActivity"
import { ActivityCard } from "./ActivityCard"

const ACTIVITY_FILTERS = ["All", "Editing", "Join", "NFTs"] as const

export const RecentActivity = () => {
  const [activityFilter, setActivityFilter] =
    useState<(typeof ACTIVITY_FILTERS)[number]>("All")
  const activities = useActivity()
  console.log(activities.data)

  return (
    <>
      <ToggleGroup
        type="single"
        variant="primary"
        size="sm"
        className="mb-4 gap-1.5"
        onValueChange={(value) =>
          value && setActivityFilter(value as (typeof ACTIVITY_FILTERS)[number])
        }
        value={activityFilter}
      >
        {ACTIVITY_FILTERS.map((filter) => (
          <ToggleGroupItem value={filter} key={filter}>
            {filter}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {activities.data?.slice(0, 20).map((activity) => (
          <ActivityCard activity={activity} key={activity.id} />
        ))}
      </div>
    </>
  )
}
