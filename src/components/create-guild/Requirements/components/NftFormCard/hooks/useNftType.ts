import useSWR from "swr"
import { SupportedChains } from "types"

const useNftType = (
  contractAddress: string,
  chain: SupportedChains
): { nftType: "ERC1155" | "SIMPLE"; isLoading: boolean } => {
  const { data: nftType, isValidating: isLoading } = useSWR(
    contractAddress
      ? `/guild/util/contractType/${contractAddress}/1/${chain}`
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )

  return { nftType, isLoading }
}

export default useNftType
