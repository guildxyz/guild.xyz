"use client"

import { useState } from "react"
import { ClaimPass } from "./ClaimPass"
import { PurchasePass } from "./PurchasePass"
import { StartProfile } from "./StartProfile"

const progressionPanes = [ClaimPass, PurchasePass, StartProfile] as const

export const OnboardingDriver = () => {
  const [progressionIndex, setProgressionIndex] = useState(2)
  const OnboardingCard = progressionPanes[progressionIndex]

  return <OnboardingCard />
}
