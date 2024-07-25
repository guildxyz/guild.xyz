"use client"

import { Button } from "@/components/ui/Button"
import { cardClassName } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
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
  const [chainIndex, setChainIndex] = useState(1)
  // TODO: remove default chosen subscription, as it is only there for debug
  // purposes
  const [chainData, setChainData] = useState<Partial<ChainData>>({
    chosenSubscription: SUBSCRIPTIONS[0],
  })
  const OnboardingCard = chains[chainIndex]

  const dispatchChainAction: DispatchChainAction = (action, data) => {
    setChainData((prev) => ({ ...prev, ...data }))
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
      <div className="fixed bottom-4 left-4 z-10 space-x-2">
        <Button onClick={() => dispatchChainAction("previous")}>previous</Button>
        <Button onClick={() => dispatchChainAction("next")}>next</Button>
      </div>

      <div
        className={cn(
          cardClassName,
          "mx-auto max-w-max bg-gradient-to-b from-card to-card-secondary shadow-2xl"
        )}
        // layout
        // style={{
        //   borderRadius: "16px",
        // }}
      >
        {/* <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={chainIndex}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.24,
            }}
            className="overflow-hidden"
          > */}
        <OnboardingCard
          dispatchChainAction={dispatchChainAction}
          chainData={chainData}
        />
        {/* </motion.div>
        </AnimatePresence> */}
      </div>
    </>
  )
}
