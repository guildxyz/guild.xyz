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

const currentDate = new Date()
currentDate.setUTCHours(0, 0, 0, 0)
const noonUnixTimestamp = currentDate.getTime() / 1000

const fetchNftDetails = ([_, chain, address]) =>
  fetcher(`/api/nft/${chain}/${address}`)

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
        functionName: "totalSupply",
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
    query: {
      staleTime: Infinity,
    },
  })

  const [totalSupplyResponse, tokenURIResponse, feeResponse] = data || []

  const totalSupply = totalSupplyResponse?.result
  const tokenURI = tokenURIResponse?.result
  const fee = feeResponse?.result

  const { data: metadata } = useSWRImmutable(
    tokenURI ? ipfsToGuildGateway(tokenURI) : null
  )

  return {
    ...nftDetails,
    name: nftDetails?.name ?? guildPlatformData?.name,
    totalCollectors:
      typeof totalSupply === "bigint" ? Number(totalSupply) : undefined,
    totalCollectorsToday:
      typeof totalSupply === "bigint" && typeof firstTotalSupplyToday === "bigint"
        ? Number(totalSupply - firstTotalSupplyToday)
        : undefined,
    image: ipfsToGuildGateway(metadata?.image),
    description: metadata?.description as string,
    fee,
    isLoading:
      isNftDetailsLoading || isFirstTotalSupplyTodayLoadings || isMulticallLoading,

    error: nftDetailsError || multicallError || error,
    refetch,
  }
}

export default useNftDetails
