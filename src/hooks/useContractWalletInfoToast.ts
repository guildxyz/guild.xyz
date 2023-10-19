import { CHAIN_CONFIG, Chain, Chains, supportedChains } from "connectors"
import useToast from "hooks/useToast"
import { useEffect } from "react"
import { createPublicClient, http, trim } from "viem"
import { useAccount, useChainId } from "wagmi"

const chainsOfAddressWithDeployedContract = (address: `0x${string}`) =>
  Promise.all(
    supportedChains.map(async (chain) => {
      const publicClient = createPublicClient({
        chain: CHAIN_CONFIG[chain],
        transport: http(),
      })

      const bytecode = await publicClient
        .getBytecode({
          address,
        })
        .catch(() => null)

      return [chain, bytecode && trim(bytecode) !== "0x"]
    })
  ).then(
    (results) =>
      new Set(
        results.filter(([, hasContract]) => !!hasContract).map(([chain]) => chain)
      )
  )

const useContractWalletInfoToast = () => {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  const toast = useToast()

  useEffect(() => {
    if (!isConnected || !chainId) {
      return
    }

    chainsOfAddressWithDeployedContract(address)
      .then((chainsWithDeployedContract) => {
        if (
          chainsWithDeployedContract.size > 0 &&
          !chainsWithDeployedContract.has(Chains[chainId] as Chain)
        ) {
          toast({
            status: "info",
            title: "Verification might fail",
            description: `If you connected a smart contract wallet, you might need to switch to a chain which has a deployed contract`,
          })
        }
      })
      .catch(() => {})
  }, [chainId, address, isConnected])
}

export default useContractWalletInfoToast
