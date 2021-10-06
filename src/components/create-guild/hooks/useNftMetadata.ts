import useSWRImmutable from "swr/immutable"
import { NFT } from "temporaryData/types"

const fetchNfts = async (nftSlug: string) =>
  fetch(`/api/metadata/${nftSlug}`).then((data) => data.json())

const useNftMetadata = (nftSlug: string): Array<NFT> => {
  const { data } = useSWRImmutable(["nftmetadata", nftSlug], () =>
    fetchNfts(nftSlug)
  )

  return data
}

export default useNftMetadata
