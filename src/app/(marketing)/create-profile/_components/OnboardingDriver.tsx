"use client"

import { Button } from "@/components/ui/Button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup"
import { useState } from "react"
import { SUBSCRIPTIONS } from "../constants"
import { ChainData, DispatchChainAction, OnboardingChain } from "../types"
import { ChoosePass } from "./ChoosePass"
import { ClaimPass } from "./ClaimPass"
import { PurchasePass } from "./PurchasePass"
import { StartProfile } from "./StartProfile"

const chains: OnboardingChain[] = [
  ClaimPass,
  ChoosePass,
  PurchasePass,
  StartProfile,
] as const

export const OnboardingDriver = () => {
  const [chainIndex, setChainIndex] = useState(0)
  // TODO: remove default chosen subscription, as it is only there for debug
  // purposes
  const [chainData, setChainData] = useState<Partial<ChainData>>({
    chosenSubscription: SUBSCRIPTIONS[0],
  })
  const OnboardingCard = chains[chainIndex]

  const dispatchChainAction: DispatchChainAction = (action, data) => {
    if (data) setChainData((prev) => ({ prev, ...data }))
    if (action === "next" && chains.length > chainIndex + 1) {
      setChainIndex((prev) => prev + 1)
      return
    }
    if (action === "previous" && 0 < chainIndex) {
      setChainIndex((prev) => prev - 1)
    }
  }

  return (
    <>
      <ToggleGroup
        className="fixed bottom-4 left-4 z-10"
        type="single"
        value={chainIndex.toString()}
        onValueChange={(value) => value && setChainIndex(Number.parseInt(value))}
      >
        {chains.map((pane, index) => (
          <ToggleGroupItem value={index.toString()} key={pane.name}>
            {pane.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="fixed right-4 bottom-4 z-10 space-x-2">
        <Button onClick={() => dispatchChainAction("previous")}>previous</Button>
        <Button onClick={() => dispatchChainAction("next")}>next</Button>
      </div>
      <OnboardingCard dispatchChainAction={dispatchChainAction} data={chainData} />
    </>
  )
}
