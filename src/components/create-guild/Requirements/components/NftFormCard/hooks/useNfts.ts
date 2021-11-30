import useSWRImmutable from "swr/immutable"
import { NFT } from "temporaryData/types"

const fetchNfts = async () =>
  fetch(`${process.env.NEXT_PUBLIC_GUILD_API}/nft`).then((data) => data.json())
const fetchNftsByPrefix = async (_: string, prefix: string) =>
  fetch(`${process.env.NEXT_PUBLIC_GUILD_API}/nft/prefix/${prefix}`).then((data) =>
    data.json()
  )

const useNfts = (
  prefix: string,
  minLength?: number
): { nfts: Array<NFT>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable(
    ["nfts", prefix],
    (typeof minLength === "number" &&
      (prefix.length >= minLength ? fetchNftsByPrefix : () => [])) ||
      fetchNfts
  )

  return { nfts: data, isLoading: isValidating }
}

export default useNfts
