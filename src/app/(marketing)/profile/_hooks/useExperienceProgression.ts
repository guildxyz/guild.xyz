import { MAX_LEVEL, RANKS, XP_SUM } from "../[username]/constants"
import { useExperiences } from "../_hooks/useExperiences"

const generateExponentialArray = (
  steps: number,
  sum: number,
  exponent: number
): number[] => {
  const baseSum = (Math.pow(exponent, steps) - 1) / (exponent - 1)
  const scaleFactor = sum / baseSum
  return Array.from({ length: steps }, (_, i) => Math.pow(exponent, i) * scaleFactor)
}

export const calculateXpProgression = ({
  experienceCount,
}: { experienceCount: number }) => {
  if (MAX_LEVEL < 1) throw new Error(`max level must be positive`)
  const levels = generateExponentialArray(MAX_LEVEL, XP_SUM, 1.008)
    .map((num) => Math.floor(num))
    .map((value, _, arr) => value - arr[0])
  const levelIndex = levels.findIndex((xp) => experienceCount < xp)
  const level = levelIndex === -1 ? MAX_LEVEL : levelIndex
  const currentLevelXp = level > 0 ? levels[level - 1] : 0
  const nextLevelXp = level < MAX_LEVEL ? levels[level] : levels[MAX_LEVEL - 1]
  const progress = Math.min(
    (experienceCount - currentLevelXp) / (nextLevelXp - currentLevelXp),
    1
  )
  const rank = RANKS[Math.floor(level / (MAX_LEVEL / RANKS.length))]

  return { progress, rank, currentLevelXp, nextLevelXp, experienceCount, level }
}

export const useExperienceProgression = (showOwnProfile?: boolean) => {
  const { data: experienceCount } = useExperiences({ showOwnProfile, count: true })
  return typeof experienceCount === "number"
    ? calculateXpProgression({ experienceCount })
    : undefined
}
