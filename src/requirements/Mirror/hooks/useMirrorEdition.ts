import { Chain } from "connectors"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const fetchMirrorEdition = (_: string, address: string, chain: Chain) =>
  fetcher(`/api/mirror-asset-data/${address}/${chain}`)

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const useMirrorEdition = (
  address: string,
  chain: Chain = "OPTIMISM"
): { name: string; image: string; isLoading: boolean; error: any } => {
  const { data, isValidating, error } = useSWRImmutable(
    address &&
      address.match(ADDRESS_REGEX) &&
      (chain === "OPTIMISM" || chain === "ETHEREUM")
      ? ["mirrorEdition", address, chain]
      : null,
    fetchMirrorEdition
  )

  return {
    name: data?.name,
    image: data?.imageURI ? `https://ipfs.fleek.co/ipfs/${data.imageURI}` : null,
    isLoading: isValidating,
    error,
  }
}

export default useMirrorEdition
