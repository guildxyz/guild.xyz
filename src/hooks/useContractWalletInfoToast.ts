import { datadogRum } from "@datadog/browser-rum"
import { hexStripZeros } from "@ethersproject/bytes"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chain, Chains, RPC, supportedChains } from "connectors"
import useToast from "hooks/useToast"
import { useEffect } from "react"

const chainsOfAddressWithDeployedContract = (address: string) =>
  Promise.all(
    supportedChains.map(async (chain) => {
      const rpcUrl = RPC[chain]?.rpcUrls?.[0]
      const prov = new JsonRpcProvider(rpcUrl)

      const bytecode = await prov.getCode(address).catch((error) => {
        datadogRum?.addError(`Retrieving bytecode failed on chain ${chain}`, {
          error,
        })
        return null
      })
      return [chain, bytecode && hexStripZeros(bytecode) !== "0x"]
    })
  ).then(
    (results) =>
      new Set(
        results.filter(([, hasContract]) => !!hasContract).map(([chain]) => chain)
      )
  )

const useContractWalletInfoToast = () => {
  const { account, chainId } = useWeb3React()
  const toast = useToast()

  useEffect(() => {
    chainsOfAddressWithDeployedContract(account)
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
  }, [chainId])
}

export default useContractWalletInfoToast
