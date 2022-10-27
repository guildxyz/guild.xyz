import { Chain } from "connectors"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const fetchMirrorEdition = (_: string, address: string, chain: Chain) =>
  fetcher(`/api/mirror-asset-data/${address}/${chain}`)

const useMirrorEdition = (
  address: string,
  chain: Chain = "OPTIMISM"
): { name: string; image: string; isLoading: boolean } => {
  const { data, isValidating } = useSWRImmutable(
    address && (chain === "OPTIMISM" || chain === "ETHEREUM")
      ? ["mirrorEdition", address, chain]
      : null,
    fetchMirrorEdition
  )

  return {
    name: data?.name,
    image: data?.imageURI ? `https://ipfs.fleek.co/ipfs/${data.imageURI}` : null,
    isLoading: isValidating,
  }
}

export default useMirrorEdition
