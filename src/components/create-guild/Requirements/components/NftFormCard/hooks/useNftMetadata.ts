import useSWRImmutable from "swr/immutable"

const fetchNfts = async (_: string, address: string, nftSlug: string) => {
  if (address && !nftSlug)
    return fetch(`${process.env.NEXT_PUBLIC_GUILD_API}/nft/address/${address}`)
      .then((res) => res.json())
      .then((data) => (!data.error ? data : {}))

  return fetch(`${process.env.NEXT_PUBLIC_GUILD_API}/nft/${nftSlug}`)
    .then((res) => res.json())
    .then((data) => (!data.error ? data : {}))
}

const useNftMetadata = (
  address: string,
  nftSlug: string
): { metadata: Record<string, Array<string>>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable(
    address ? ["nftmetadata", address, nftSlug] : null,
    fetchNfts
  )

  return { isLoading: isValidating, metadata: data }
}

export default useNftMetadata
