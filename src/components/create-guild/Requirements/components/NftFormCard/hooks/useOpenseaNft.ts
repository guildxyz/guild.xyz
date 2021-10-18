import useSWRImmutable from "swr/immutable"
import { NFT } from "temporaryData/types"

const fetchOpenseaNft = async (address: string) =>
  fetch(`/api/opensea/${address}`).then((data) => data.json())

const useOpenseaNft = (address: string): { nft: NFT; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable(
    address ? ["openseaNft", address] : null,
    () => fetchOpenseaNft(address)
  )

  return { nft: data, isLoading: isValidating }
}

export default useOpenseaNft
