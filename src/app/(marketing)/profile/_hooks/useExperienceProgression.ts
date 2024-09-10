import { MAX_LEVEL, MAX_XP, RANKS } from "../[username]/constants"
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
  const levels = [...generateExponentialArray(MAX_LEVEL, MAX_XP, 1.03)]
  const levelIndex = Math.max(
    0,
    levels.findIndex((level) => experienceCount < level)
  )
  const levelInRank = Math.floor(MAX_LEVEL / RANKS.length)
  const rankIndex = Math.max(0, (levelIndex - 1) % levelInRank)
  const rank = RANKS.at(rankIndex)
  if (!rank) throw new Error("failed to calculate rank")
  const nextLevel = levels.at(levelIndex + 1)
  const progress = nextLevel ? experienceCount / nextLevel || 0 : 0
  return { progress, rank, levelIndex }
}

export const useExperienceProgression = () => {
  const { data: experienceCount } = useExperiences(true)
  return experienceCount && calculateXpProgression({ experienceCount })
}
