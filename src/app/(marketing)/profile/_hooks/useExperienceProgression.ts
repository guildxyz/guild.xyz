import { MAX_LEVEL, RANKS } from "../[username]/constants"
import { useExperiences } from "../_hooks/useExperiences"

const generateExponentialArray = (steps: number, exponent: number): number[] => {
  return Array.from({ length: steps }, (_, i) => Math.pow(i, exponent))
}

export const calculateXpProgression = ({
  experienceCount,
}: { experienceCount: number }) => {
  const levels = generateExponentialArray(MAX_LEVEL, 2).map((num) => Math.floor(num))
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
