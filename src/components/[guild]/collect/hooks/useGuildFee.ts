import { consts } from "@guildxyz/types"
import guildRewardNFTFactoryAbi from "static/abis/guildRewardNFTFactory"
import { useReadContract } from "wagmi"
import { Chain, Chains } from "wagmiConfig/chains"

// TODO: remove this once we deploy the contracts on all chains
const chainsWithOverrides = [
  "BASE_MAINNET",
  "BSC",
  "ARBITRUM",
  "OPTIMISM",
  "POLYGON",
  "INK",
  "IOTA",
  "SONIC",
  "ZERO",
  "MANTLE",
  "XDC",
  "SONEIUM",
]

const useGuildFee = (
  chain: Chain,
  contractAddress?: `0x${string}`
): { guildFee: bigint; isLoading: boolean; error: any } => {
  const {
    data: guildFee,
    isLoading,
    error,
  } = useReadContract({
    abi: guildRewardNFTFactoryAbi,
    chainId: Chains[chain],
    address: consts.NFTRewardFactoryAddresses[chain],
    functionName:
      contractAddress && chainsWithOverrides.includes(chain)
        ? "getFeeWithOverrides"
        : "fee",
    args:
      contractAddress && chainsWithOverrides.includes(chain)
        ? [contractAddress]
        : [],
  })

  return {
    guildFee,
    isLoading,
    error,
  }
}

export default useGuildFee
