import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const fetchMirrorEdition = (_: string, address: string) =>
  fetcher(`/api/mirror-asset-data/${address}`)

const useMirrorEdition = (
  address: string
): { name: string; image: string; isLoading: boolean } => {
  const { data, isValidating } = useSWRImmutable(
    address ? ["mirrorEdition", address] : null,
    fetchMirrorEdition
  )

  return {
    name: data?.name,
    image: data?.imageURI ? `https://ipfs.fleek.co/ipfs/${data.imageURI}` : null,
    isLoading: isValidating,
  }
}

export default useMirrorEdition
