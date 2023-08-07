import { BigNumber } from "@ethersproject/bignumber"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Chain, Chains, RPC } from "connectors"
import DELEGATE_ABI from "static/abis/delegateRegistry.json"
import { Contract, Provider } from "utils/multicall"

// https://docs.delegate.cash/delegatecash/technical-documentation/delegation-registry/contract-addresses
const delegateAddresses = {
  [Chains.ETHEREUM]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.POLYGON]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.CELO]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.OPTIMISM]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.AVALANCHE]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.GOERLI]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.ARBITRUM]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.NOVA]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.BASE_MAINNET]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.BSC]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.FANTOM]: "0x00000000000076a84fef008cdabe6409d2fe638b",
  [Chains.GNOSIS]: "0x00000000000076a84fef008cdabe6409d2fe638b",
}

enum DelegationType {
  NONE,
  ALL,
  CONTRACT,
  TOKEN,
}

type RawDelegationResult = [
  DelegationType,
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
  const provider = new JsonRpcProvider(RPC[chainName].rpcUrls[0])

  const multicallProvider = new Provider(provider, RPC[chainName].chainId)

  const delegateContract = new Contract(contractAddress, DELEGATE_ABI)

  const results: RawDelegationResult[][] = await multicallProvider.all(
    delegates.map((delegate) => delegateContract.getDelegationsByDelegate(delegate))
  )

  return results
    .flatMap((contractResults) =>
      contractResults
        .filter(([type]) => type === DelegationType.ALL)
        .map(([, vault]) => vault.toLowerCase())
    )
    .filter(Boolean)
}

const getDelegateVaults = async (delegates: string[]) => {
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

export { delegateAddresses, getDelegateVaults }
