"use client"

import { useState } from "react"
import { GuildPassInvite } from "../_components/GuildPassInvite"
import { GuildPassPicker } from "../_components/GuildPassPicker"

const progressionPanes = [GuildPassInvite, GuildPassPicker] as const

export const OnboardingDriver = () => {
  const [progressionIndex, setProgressionIndex] = useState(1)
  const OnboardingCard = progressionPanes[progressionIndex]

  return <OnboardingCard />
}
