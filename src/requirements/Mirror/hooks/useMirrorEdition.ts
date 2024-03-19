import mirrorAbi from "static/abis/mirror"
import { useReadContracts } from "wagmi"
import { Chain, Chains } from "wagmiConfig/chains"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const useMirrorEdition = (
  address: `0x${string}`,
  chain: Chain = "OPTIMISM",
): { name: string; image: string; isLoading: boolean; error: any } => {
  const enabled =
    address &&
    address.match(ADDRESS_REGEX) &&
    (chain === "OPTIMISM" || chain === "ETHEREUM")

  const contract = { abi: mirrorAbi, chainId: Chains[chain], address } as const

  const { data, isLoading, error } = useReadContracts({
    /**
     * We need to @ts-ignore this line, since we get a "Type instantiation is
     * excessively deep and possibly infinite" error here until strictNullChecks is
     * set to false in our tsconfig. We should set it to true & sort out the related
     * issues in another PR.
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
    query: {
      enabled,
    },
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
