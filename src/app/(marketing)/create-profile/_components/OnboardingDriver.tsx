"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import { useState } from "react"
import { ClaimPass } from "./ClaimPass"
import { PurchasePass } from "./PurchasePass"
import { StartProfile } from "./StartProfile"

const progressionPanes = [ClaimPass, PurchasePass, StartProfile] as const

export const OnboardingDriver = () => {
  const [progressionIndex, setProgressionIndex] = useState(0)
  const OnboardingCard = progressionPanes[progressionIndex]

  return (
    <>
      <ToggleGroup
        className="fixed bottom-4 left-4 z-10"
        type="single"
        value={progressionIndex.toString()}
        onValueChange={(value) => setProgressionIndex(Number.parseInt(value))}
      >
        {progressionPanes.map((pane, index) => (
          <ToggleGroupItem value={index.toString()} key={pane.name}>
            {pane.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <OnboardingCard />
    </>
  )
}
