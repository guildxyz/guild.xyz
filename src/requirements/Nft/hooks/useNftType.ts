import { Chain } from "connectors"
import useSWR from "swr"

const nounsAddresses = {
  ETHEREUM: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03".toLowerCase(),
}

const useNftType = (
  contractAddress: string,
  chain: Chain
): { nftType: "ERC1155" | "SIMPLE" | "NOUNS"; isLoading: boolean } => {
  const isNounsContract =
    !!chain &&
    !!contractAddress &&
    nounsAddresses[chain] === contractAddress?.toLowerCase()

  const { data: nftType, isLoading } = useSWR(
    contractAddress && !isNounsContract
      ? `/v2/util/chains/${chain}/contracts/${contractAddress}/tokens/1`
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )

  if (isNounsContract) {
    return { nftType: "NOUNS", isLoading: false }
  }

  return { nftType, isLoading }
}

export { nounsAddresses }
export default useNftType
