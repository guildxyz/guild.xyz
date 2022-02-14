import useSWRImmutable from "swr/immutable"

const useNftMetadata = (
  address: string,
  nftSlug: string
): { metadata: Record<string, Array<string>>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable(
    address
      ? `${process.env.NEXT_PUBLIC_GUILD_API}/nft/${
          nftSlug ? nftSlug : `address/${address}`
        }`
      : null,
    {
      shouldRetryOnError: false,
    }
  )

  return { isLoading: isValidating, metadata: data }
}

export default useNftMetadata
