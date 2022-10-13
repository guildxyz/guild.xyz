import useSWRImmutable from "swr/immutable"

const useNftImage = (address: string) => {
  const { data, isValidating } = useSWRImmutable<{ image: string }>(
    address ? `/api/opensea-asset-data/${address}` : null
  )

  return { nftImage: data?.image, isLoading: isValidating }
}

export default useNftImage
