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
  const levels = generateExponentialArray(MAX_LEVEL, MAX_XP, 1.03).map((num) =>
    Math.floor(num)
  )
  let levelIndex = levels.findIndex((level) => experienceCount < level)
  levelIndex = levelIndex === -1 ? levels.length - 1 : levelIndex
  const level = levels.at(levelIndex)
  const levelInRank = Math.floor(MAX_LEVEL / RANKS.length)
  const rankIndex = Math.max(0, Math.floor((levelIndex - 1) / levelInRank))
  const rank = RANKS.at(rankIndex)
  if (!rank || !level) throw new Error("failed to calculate rank")
  const nextLevel = levels.at(levelIndex + 1)
  const progress = experienceCount / (nextLevel || experienceCount)
  return { progress, rank, levelIndex, experienceCount, level }
}

export const useExperienceProgression = (showOwnProfile?: boolean) => {
  const { data: experienceCount } = useExperiences({ showOwnProfile, count: true })
  return typeof experienceCount === "number"
    ? calculateXpProgression({ experienceCount })
    : undefined
}
