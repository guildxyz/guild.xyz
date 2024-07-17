"use client"

import { useAtom } from "jotai"
import { onboardingProgressionIndexAtom } from "../atoms"
import { GuildPassInvite } from "./GuildPassInvite"
import { GuildPassPicker } from "./GuildPassPicker"

const progressionPanes = [<GuildPassInvite />, <GuildPassPicker />]

export const OnboardingStepper = () => {
  const [onboardingProgressonIndex, setOnboardingProgressionIndex] = useAtom(
    onboardingProgressionIndexAtom
  )

  setOnboardingProgressionIndex(1)

  return progressionPanes[onboardingProgressonIndex]
}
