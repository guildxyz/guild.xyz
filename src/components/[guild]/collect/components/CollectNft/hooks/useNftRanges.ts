import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import { useMemo } from "react"
import { useCollectNftContext } from "../../CollectNftContext"

type MintingRange = {
  name: string
  icon: string
  min: number
  max: number
}

/**
 * Notes:
 *
 * - We'll always have 4 different ranges
 * - Infinite is when mintableAmountPerUser = 0, but we don't need to handle that case,
 *   since we won't show this component for that kind of NFTs
 */
const getMintingRanges = (
  mintableAmountPerUser: number
): [MintingRange, MintingRange, MintingRange, MintingRange] => {
  const cappedMintableAmountPerUser = Math.min(mintableAmountPerUser || 100, 100)
  const [range1Max, range2Max, range3Max] = [
    Math.floor(cappedMintableAmountPerUser * 0.03),
    Math.floor(cappedMintableAmountPerUser * 0.32),
    Math.floor(cappedMintableAmountPerUser * 0.99),
  ]

  return [
    {
      name: "Shrimp",
      icon: "🦐",
      min: 1,
      max: range1Max,
    },
    {
      name: "Fish",
      icon: "🐠",
      min: range1Max + 1,
      max: range2Max,
    },
    {
      name: "Dolphin",
      icon: "🐬",
      min: range2Max + 1,
      max: range3Max,
    },
    {
      name: "Whale",
      icon: "🐋",
      min: range3Max + 1,
      max: cappedMintableAmountPerUser,
    },
  ]
}

const useNftRanges = () => {
  const { chain, nftAddress } = useCollectNftContext()
  const { mintableAmountPerUser } = useNftDetails(chain, nftAddress)

  return useMemo(
    () =>
      getMintingRanges(
        mintableAmountPerUser !== BigInt(0) ? Number(mintableAmountPerUser) : 100
      ),
    [mintableAmountPerUser]
  )
}

export default useNftRanges
