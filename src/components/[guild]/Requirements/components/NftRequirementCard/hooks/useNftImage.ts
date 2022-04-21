import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

// TODO: request an API key and use that (this is a rate-limited endpoint!)
const fetchAndMapNftData = (address: string) =>
  fetcher(`https://api.opensea.io/api/v1/asset_contract/${address}`)
    .then((openseaData) => openseaData.image_url)
    .catch((_) => null)

const useNftImage = (address: string) => {
  const { data, isValidating } = useSWRImmutable<string>(
    address ?? null,
    fetchAndMapNftData
  )

  return { nftImage: data, isLoading: isValidating }
}

export default useNftImage
