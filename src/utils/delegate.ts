import { BigNumber } from "@ethersproject/bignumber"
import { aggregateDecodedFromABI } from "@makerdao/multicall"
import { Chain, Chains, RPC } from "connectors"
import DELEGATE_REGISTRY_ABI from "static/abis/delegateRegistry.json"

// https://docs.delegate.cash/delegatecash/technical-documentation/delegation-registry/contract-addresses
const delegateAddresses = {
  [Chains.ETHEREUM]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.POLYGON]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.CELO]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.OPTIMISM]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.AVALANCHE]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.GOERLI]: "0x00000000000076a84fef008cdabe6409d2fe638b",
}

type RawDelegationResult = [
  number, // Delegation type, enum, could be typed better, but we don't use this information
  string, // Vault address
  string, // Delegate address
  string, // Contract address (zero address if irrelevant)
  BigNumber // token id (zero if irrelevant)
]

const multicallGetDelegationsByDelegate = async (
  chainName: Chain,
  contractAddress: string,
  delegates: string[]
) => {
  const {
    multicallAddress,
    rpcUrls: [rpcUrl],
  } = RPC[chainName]

  const results: RawDelegationResult[][][] = await aggregateDecodedFromABI(
    delegates.map((delegate) => ({
      target: contractAddress,
      call: ["getDelegationsByDelegate", delegate],
      abi: DELEGATE_REGISTRY_ABI,
    })),
    { multicallAddress, rpcUrl }
  )

  return results
    .flatMap(([contractResults]) => contractResults.map((res) => res[1]))
    .filter(Boolean)
}

const getVaults = async (delegates: string[]) => {
  const allVaultsByChain = await Promise.all(
    Object.entries(delegateAddresses).map(([chainId, contractAddress]) =>
      multicallGetDelegationsByDelegate(
        Chains[+chainId] as Chain,
        contractAddress,
        delegates
      ).catch(() => [])
    )
  )

  return [...new Set(allVaultsByChain.flat().map((vault) => vault.toLowerCase()))]
}

export { delegateAddresses, getVaults }
