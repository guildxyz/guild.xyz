import useGuild from "components/[guild]/hooks/useGuild"
import { NFTDetails } from "pages/api/nft/[chain]/[address]"
import guildRewardNftAbi from "static/abis/guildRewardNft"
import useSWRImmutable from "swr/immutable"
import { PlatformGuildData, PlatformType } from "types"
import fetcher from "utils/fetcher"
import { getBlockByTime } from "utils/getBlockByTime"
import ipfsToGuildGateway from "utils/ipfsToGuildGateway"
import { useReadContract, useReadContracts } from "wagmi"
import { Chain, Chains } from "wagmiConfig/chains"
import { z } from "zod"

const currentDate = new Date()
currentDate.setUTCHours(0, 0, 0, 0)
const noonUnixTimestamp = currentDate.getTime() / 1000

const fetchNftDetails = ([_, chain, address]) =>
  fetcher(`/api/nft/${chain}/${address}`)

export const guildNftRewardMetadataSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().min(1),
  attributes: z
    .array(
      z.object({
        trait_type: z.string().min(1),
        value: z.string().min(1),
      })
    )
    .default([]),
})

const fetchNftMetadata = (url: string) =>
  fetcher(url).then((metadata) => guildNftRewardMetadataSchema.parse(metadata))

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

  const {
    data: nftDetails,
    isLoading: isNftDetailsLoading,
    error: nftDetailsError,
  } = useSWRImmutable<NFTDetails>(
    shouldFetch ? ["nftDetails", chain, address] : null,
    fetchNftDetails
  )

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
    blockNumber: firstBlockNumberToday ? BigInt(firstBlockNumberToday) : undefined,
    query: {
      enabled: !!firstBlockNumberToday,
      staleTime: 600_000,
      refetchOnWindowFocus: false,
      retry: false,
    },
  })

  const {
    data,
    isLoading: isMulticallLoading,
    error: multicallError,
    refetch,
  } = useReadContracts({
    /**
     * We need to @ts-ignore this line, since we get a "Type instantiation is
     * excessively deep and possibly infinite" error here until strictNullChecks is
     * set to false in our tsconfig. We should set it to true & sort out the related
     * issues in another PR.
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    contracts: [
      {
        ...contract,
        functionName: "locked",
      },
      {
        ...contract,
        functionName: "totalSupply",
      },
      {
        ...contract,
        functionName: "maxSupply",
      },
      {
        ...contract,
        functionName: "mintableAmountPerUser",
      },
      {
        ...contract,
        functionName: "tokenURI",
        args: [BigInt(0)],
      },
      {
        ...contract,
        functionName: "fee",
      },
      {
        ...contract,
        functionName: "treasury",
      },
    ],
    query: {
      staleTime: Infinity,
    },
  })

  const [
    lockedResponse,
    totalSupplyResponse,
    maxSupplyResponse,
    mintableAmountPerUserResponse,
    tokenURIResponse,
    feeResponse,
    treasuryResponse,
  ] = data || []

  const soulbound = lockedResponse?.result !== false // undefined or true means that it is "locked"
  const totalSupply = totalSupplyResponse?.result
  const maxSupply = maxSupplyResponse?.result
  const mintableAmountPerUser = mintableAmountPerUserResponse?.result
  const tokenURI = tokenURIResponse?.result
  const fee = feeResponse?.result
  const treasury = treasuryResponse?.result

  const { data: metadata, isLoading: isMetadataLoading } = useSWRImmutable(
    tokenURI ? ipfsToGuildGateway(tokenURI) : null,
    fetchNftMetadata
  )

  return {
    ...nftDetails,
    soulbound,
    name: nftDetails?.name ?? guildPlatformData?.name,
    totalSupply,
    totalCollectorsToday:
      typeof totalSupply === "bigint" && typeof firstTotalSupplyToday === "bigint"
        ? totalSupply - firstTotalSupplyToday
        : undefined,
    maxSupply: maxSupply,
    mintableAmountPerUser,
    image: ipfsToGuildGateway(metadata?.image) || guildPlatformData?.imageUrl,
    description: metadata?.description,
    fee,
    treasury,
    attributes: metadata?.attributes,
    isLoading:
      isNftDetailsLoading ||
      isFirstTotalSupplyTodayLoadings ||
      isMulticallLoading ||
      isMetadataLoading,

    error: nftDetailsError || multicallError || error,
    refetch,
  }
}

export default useNftDetails
