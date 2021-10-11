import useSWRImmutable from "swr/immutable"

const fetchNfts = async (nftSlug: string) =>
  fetch(`/api/metadata/${nftSlug}`).then((data) => data.json())

const useNftMetadata = (
  nftSlug: string
): { metadata: Record<string, Array<string>>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable(
    nftSlug ? ["nftmetadata", nftSlug] : null,
    () => fetchNfts(nftSlug)
  )

  return { isLoading: isValidating, metadata: data }
}

export default useNftMetadata
