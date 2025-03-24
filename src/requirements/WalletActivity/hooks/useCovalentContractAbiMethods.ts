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

const fetchInkContractMethods = async (baseUrl: string, address: string) => {
  let contract: {
    proxy_type: string | null
    implementations: {
      address: string
      name: string | null
    }[]
    abi: Abi
  } = await fetcher(`${baseUrl}/smart-contracts/${address}`)

  const implementationAddress = contract.implementations.at(-1)?.address

  if (!!contract.proxy_type && implementationAddress) {
    contract = await fetcher(`${baseUrl}/smart-contracts/${implementationAddress}`)
  }

  if (!contract.abi)
    return Promise.reject({
      error: "Couldn't fetch contract ABI",
    })

  return contract.abi.filter((item) => isContractWriteFunction(item))
}

const fetchEtherscanContractMethods = async (
  chain: CovalentContractCallCountChain,
  address: string
) => {
  const abi: Abi = await fetcher(`/api/contract-abi/${chain}/${address}`)
  return abi.filter((item) => isContractWriteFunction(item))
}

const CONTRACT_METHOD_FETCHERS = {
  INK: (address: string) =>
    fetchInkContractMethods("https://explorer.inkonchain.com/api/v2", address),
  INK_SEPOLIA: (address: string) =>
    fetchInkContractMethods(
      "https://explorer-sepolia.inkonchain.com/api/v2",
      address
    ),
  SONIC: (address: string) => fetchEtherscanContractMethods("SONIC", address),
} satisfies Record<
  CovalentContractCallCountChain,
  (address: string) => Promise<AbiWriteFunction[]>
>

export const useCovalentContractAbiMethods = (
  chain: CovalentContractCallCountChain | undefined,
  address: string | undefined
) =>
  useSWRImmutable(
    chain && address ? ["covalent-abi-methods", chain, address] : null,
    ([_, _chain, _address]) => CONTRACT_METHOD_FETCHERS[_chain](_address)
  )
