import useUser from "components/[guild]/hooks/useUser"
import { Chains } from "connectors"
import delegateRegistryAbi from "static/abis/delegateRegistry"
import { useContractReads } from "wagmi"

enum DelegationType {
  NONE,
  ALL,
  CONTRACT,
  TOKEN,
}

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
} as const

// address for testing: 0xaaf3a70b7bcd9d0c20213981d91042683bd215f0 (should return "0x82407168ca396e800e55c8667af2a7516c5140dd" vault on Goerli)
const useDelegateVaults = () => {
  const { id, addresses } = useUser()

  const enabled = typeof id === "number" && Array.isArray(addresses)

  const delegateContracts = Object.entries(delegateAddresses).map(
    ([chainId, contractAddress]) => ({
      abi: delegateRegistryAbi,
      address: contractAddress,
      chainId: Number(chainId),
      functionName: "getDelegationsByDelegate",
    })
  )

  const delegates = addresses?.map(({ address }) => address)

  const { data } = useContractReads({
    contracts: delegates
      ?.map((delegate) =>
        delegateContracts.map((contract) => ({ ...contract, args: [delegate] }))
      )
      .flat(),
    enabled,
  })

  // WAGMI TODO: not sure if this logic is correct, we'll need to test it!
  const results = data
    ?.filter((res) => res.status === "success")
    .map((res) => res.result) as {
    contract_: `0x${string}`
    delegate: `0x${string}`
    type_: DelegationType
    tokenId: bigint
    vault: `0x${string}`
  }[]

  const alreadyLinkedAddresses = new Set(delegates ?? [])

  const unlinked = results
    ?.filter(
      (res) =>
        res.type_ === DelegationType.ALL &&
        !alreadyLinkedAddresses.has(res.vault.toLowerCase())
    )
    .map((res) => res.vault)
    .filter(Boolean)

  return unlinked
}

export default useDelegateVaults
