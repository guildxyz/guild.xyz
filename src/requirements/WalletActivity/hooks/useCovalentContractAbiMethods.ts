import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { Abi, AbiFunction, AbiStateMutability } from "viem"
import { CovalentContractCallCountChain } from "../types"

type AbiWriteFunction = AbiFunction & {
  stateMutability: Extract<AbiStateMutability, "payable" | "nonpayable">
}

const isContractWriteFunction = (f: Abi[number]): f is AbiWriteFunction => {
  return (
    f.type === "function" &&
    (f.stateMutability === "payable" || f.stateMutability === "nonpayable")
  )
}

const fetchContractMethods = async (
  baseUrl: string,
  address: string
): Promise<AbiWriteFunction[]> => {
  let contract: {
    proxy_type: string | null
    implementations: {
      address: string
      name: string | null
    }[]
    abi: Abi
  } = await fetcher(`${baseUrl}/smart-contracts/${address}`)

  if (!!contract.proxy_type) {
    // TODO: do we need to fetch each implementation? I should ask Tomi about this
    contract = await fetcher(
      `${baseUrl}/smart-contracts/${contract.implementations[0].address}`
    )
  }

  if (!contract.abi)
    return Promise.reject({
      error: "Couldn't fetch contract ABI",
    })

  return contract.abi.filter((item) => isContractWriteFunction(item))
}

const CONTRACT_METHOD_FETCHERS = {
  INK: (address: string) =>
    fetchContractMethods("https://explorer.inkonchain.com/api/v2", address),
  INK_SEPOLIA: (address: string) =>
    fetchContractMethods("https://explorer-sepolia.inkonchain.com/api/v2", address),
} satisfies Record<
  CovalentContractCallCountChain,
  (address: string) => ReturnType<typeof fetchContractMethods>
>

export const useCovalentContractAbiMethods = (
  chain: CovalentContractCallCountChain | undefined,
  address: string | undefined
) =>
  useSWRImmutable(
    chain && address ? ["covalent-abi-methods", chain, address] : null,
    ([_, _chain, _address]) => CONTRACT_METHOD_FETCHERS[_chain](_address)
  )
