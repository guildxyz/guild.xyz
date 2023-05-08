import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Chain, RPC } from "connectors"
import MIRROR_CONTRACT_ABI from "static/abis/mirrorAbi.json"
import useSWRImmutable from "swr/immutable"

const fetchMirrorEdition = async (_: string, address: string, chain: Chain) => {
  const provider = new JsonRpcProvider(RPC[chain]?.rpcUrls[0])
  const contract = new Contract(address, MIRROR_CONTRACT_ABI, provider)

  const [name, imageURI] = await Promise.all([
    contract.name().catch(() => null),
    contract.imageURI().catch(() => null),
  ])

  return {
    name,
    imageURI,
  }
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const useMirrorEdition = (
  address: string,
  chain: Chain = "OPTIMISM"
): { name: string; image: string; isLoading: boolean; error: any } => {
  const shouldFetch =
    address &&
    address.match(ADDRESS_REGEX) &&
    (chain === "OPTIMISM" || chain === "ETHEREUM")
  const { data, isLoading, error } = useSWRImmutable(
    shouldFetch ? ["mirrorEdition", address, chain] : null,
    fetchMirrorEdition
  )

  return {
    name: data?.name,
    image: data?.imageURI ? `https://ipfs.fleek.co/ipfs/${data.imageURI}` : null,
    isLoading,
    error,
  }
}

export default useMirrorEdition
