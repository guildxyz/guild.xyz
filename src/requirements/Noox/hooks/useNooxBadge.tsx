import { nooxAbi } from "static/abis/noox"
import useSWRImmutable from "swr/immutable"
import { useReadContract } from "wagmi"
import { mainnet } from "wagmi/chains"

type NooxBadgeMetadata = {
  name: string
  image_thumbnail: string
}

export const NUMBER_REGEX = /^\d+$/

const useNooxBadge = (badgeId: string) => {
  const {
    data: ipfsURL,
    isLoading: isContractCallLoading,
    isError,
  } = useReadContract({
    abi: nooxAbi,
    address: "0xf1c121a563a84d62a5f11152d064dd0d554024f9",
    chainId: mainnet.id,
    functionName: "uri",
    args: [BigInt(NUMBER_REGEX.test(badgeId) ? badgeId : 0)],
    query: {
      enabled: Boolean(NUMBER_REGEX.test(badgeId)),
    },
  })

  const { data, isValidating, error } = useSWRImmutable<NooxBadgeMetadata>(ipfsURL)

  const isLoading = isContractCallLoading || isValidating

  return {
    isError: isError || !!error,
    badgeMetaData: data,
    isLoading,
  }
}

export default useNooxBadge
