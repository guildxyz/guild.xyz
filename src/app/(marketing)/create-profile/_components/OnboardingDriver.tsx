"use client"

import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Skeleton } from "@/components/ui/Skeleton"
// import { ChoosePass } from "./ChoosePass"
// import { ClaimPass } from "./ClaimPass"
// import { PurchasePass } from "./PurchasePass"
// import { StartProfile } from "./StartProfile"
import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/Button"
// import { cardClassName } from "@/components/ui/Card"
// import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"
// import { SUBSCRIPTIONS } from "../constants"
import { OnboardingChain } from "../types"

interface OnboardingChainConfig {
  Component: OnboardingChain
  route: string
}

// const chains: OnboardingChainConfig[] = [
//   { Component: ClaimPass, route: "claim-pass" },
//   { Component: ChoosePass, route: "choose-pass" },
//   { Component: PurchasePass, route: "purchase-pass" },
//   { Component: StartProfile, route: "start-profile" },
// ] as const

export const OnboardingDriver = ({ children }: PropsWithChildren) => {
  // const [chainIndex, setChainIndex] = useState(3)
  const { address } = useWeb3ConnectionManager()
  const router = useRouter()
  console.log({ address })
  if (!address) {
    router.replace("claim-pass")
    return <Skeleton className="h-[600px] w-96" />
  }

  return children
}
