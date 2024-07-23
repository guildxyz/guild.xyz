"use client"

import { Button } from "@/components/ui/Button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import { useState } from "react"
import { ClaimPass } from "./ClaimPass"
import { PurchasePass } from "./PurchasePass"
import { StartProfile } from "./StartProfile"
import { ChainAction, OnboardingChain } from "./types"

const progressionChains: OnboardingChain[] = [
  ClaimPass,
  PurchasePass,
  StartProfile,
] as const

export const OnboardingDriver = () => {
  const [progressionIndex, setProgressionIndex] = useState(1)
  const OnboardingCard = progressionChains[progressionIndex]

  const dispatchChainAction = (action: ChainAction) => {
    if (action === "next" && progressionChains.length > progressionIndex + 1) {
      setProgressionIndex((prev) => prev + 1)
      return
    }
    if (action === "previous" && 0 < progressionIndex) {
      setProgressionIndex((prev) => prev - 1)
      return
    }
  }

  return (
    <>
      <ToggleGroup
        className="fixed bottom-4 left-4 z-10"
        type="single"
        value={progressionIndex.toString()}
        onValueChange={(value) =>
          value && setProgressionIndex(Number.parseInt(value))
        }
      >
        {progressionChains.map((pane, index) => (
          <ToggleGroupItem value={index.toString()} key={pane.name}>
            {pane.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="fixed right-4 bottom-4 z-10 space-x-2">
        <Button onClick={() => dispatchChainAction("previous")}>previous</Button>
        <Button onClick={() => dispatchChainAction("next")}>next</Button>
      </div>
      <OnboardingCard dispatchChainAction={dispatchChainAction} />
    </>
  )
}
