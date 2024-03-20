import { Chain, Chains } from "chains"
import mirrorAbi from "static/abis/mirror"
import { useContractReads } from "wagmi"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const useMirrorEdition = (
  address: `0x${string}`,
  chain: Chain = "OPTIMISM"
): { name: string; image: string; isLoading: boolean; error: any } => {
  const enabled =
    address &&
    address.match(ADDRESS_REGEX) &&
    (chain === "OPTIMISM" || chain === "ETHEREUM")

  const contract = { abi: mirrorAbi, chainId: Chains[chain], address }

  const { data, isLoading, error } = useContractReads({
    contracts: [
      {
        ...contract,
        functionName: "name",
      },
      {
        ...contract,
        functionName: "imageURI",
      },
    ],
    enabled,
  })

  const [name, imageURI] = data?.map((res) => res.result) ?? []

  return {
    name,
    image: imageURI ? `https://ipfs.fleek.co/ipfs/${imageURI}` : null,
    isLoading,
    error,
  }
}

export default useMirrorEdition
