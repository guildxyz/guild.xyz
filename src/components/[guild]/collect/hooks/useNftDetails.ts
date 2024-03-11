import { Chain, Chains } from "chains"
import useGuild from "components/[guild]/hooks/useGuild"
import guildRewardNftAbi from "static/abis/guildRewardNft"
import useSWRImmutable from "swr/immutable"
import { PlatformGuildData, PlatformType } from "types"
import { getBlockByTime } from "utils/getBlockByTime"
import { useReadContract, useReadContracts } from "wagmi"

type NftStandard = "ERC-721" | "ERC-1155" | "Unknown"

enum ContractInterface {
  "ERC721" = "0x80ac58cd",
  "ERC1155" = "0xd9b67a26",
}

export type NFTDetails = {
  creator: string
  name: string
  totalCollectors: number
  totalCollectorsToday?: number
  standard: NftStandard
  image?: string
  description?: string
  fee: bigint
}

const currentDate = new Date()
currentDate.setUTCHours(0, 0, 0, 0)
const noonUnixTimestamp = currentDate.getTime() / 1000

const useNftDetails = (chain: Chain, address: `0x${string}`) => {
  const { guildPlatforms } = useGuild()
  const relevantGuildPlatform = guildPlatforms?.find(
    (gp) =>
      gp.platformId === PlatformType.CONTRACT_CALL &&
      gp.platformGuildData.chain === chain &&
      gp.platformGuildData.contractAddress?.toLowerCase() === address?.toLowerCase()
  )
  const guildPlatformData =
    relevantGuildPlatform?.platformGuildData as PlatformGuildData["CONTRACT_CALL"]

  const shouldFetch = Boolean(chain && address)

  const { data: firstBlockNumberToday } = useSWRImmutable(
    shouldFetch ? ["firstBlockNumberToday", chain, noonUnixTimestamp] : null,
    getBlockByTime
  )

  const contract = {
    address,
    abi: guildRewardNftAbi,
    chainId: Chains[chain],
  } as const

  const {
    data: firstTotalSupplyToday,
    isLoading: isFirstTotalSupplyTodayLoadings,
    error,
  } = useReadContract({
    ...contract,
    functionName: "totalSupply",
    blockNumber: firstBlockNumberToday?.result,
    query: {
      enabled: Boolean(firstBlockNumberToday?.result),
    },
  })

  const {
    data,
    isLoading: isMulticallLoading,
    error: multicallError,
    refetch,
  } = useReadContracts({
    // WAGMI 2 TODO
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    contracts: [
      {
        ...contract,
        functionName: "owner",
      },
      {
        ...contract,
        functionName: "name",
      },
      {
        ...contract,
        functionName: "totalSupply",
      },
      {
        ...contract,
        functionName: "supportsInterface",
        args: [ContractInterface.ERC1155],
      },
      {
        ...contract,
        functionName: "tokenURI",
        args: [BigInt(1)],
      },
      {
        ...contract,
        functionName: "fee",
      },
    ],
  })

  const [
    { result: owner },
    { result: name },
    { result: totalSupply },
    { result: isERC1155 },
    { result: tokenURI },
    { result: fee },
  ] = data

  const { data: metadata } = useSWRImmutable(
    tokenURI
      ? (tokenURI as string).replace("ipfs://", process.env.NEXT_PUBLIC_IPFS_GATEWAY)
      : null
  )

  return {
    creator: owner,
    name: name as string,
    totalCollectors:
      typeof totalSupply === "bigint" ? Number(totalSupply) : undefined,
    totalCollectorsToday:
      typeof totalSupply === "bigint" && typeof firstTotalSupplyToday === "bigint"
        ? Number(totalSupply - firstTotalSupplyToday)
        : undefined,
    standard: isERC1155 ? "ERC-1155" : "ERC-721",
    image:
      metadata?.image?.replace("ipfs://", process.env.NEXT_PUBLIC_IPFS_GATEWAY) ||
      guildPlatformData?.imageUrl,
    description: metadata?.description as string,
    fee: fee as bigint,
    isLoading: isFirstTotalSupplyTodayLoadings || isMulticallLoading,

    error: multicallError || error,
    refetch,
  }
}

export default useNftDetails
