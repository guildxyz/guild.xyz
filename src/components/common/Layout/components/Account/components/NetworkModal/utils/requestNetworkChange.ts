import { BigNumber } from "@ethersproject/bignumber"
import { ExternalProvider } from "@ethersproject/providers"
import { Chains, RPC } from "connectors"

type WindowType = Window & typeof globalThis & { ethereum: ExternalProvider }

const requestNetworkChange =
  (targetNetwork: string, callback?: () => void) => async () => {
    // Not using .toHexString(), because the method requires unpadded format: '0x1' for mainnet, not '0x01'
    const chainId = `0x${(+BigNumber.from(Chains[targetNetwork])).toString(16)}`

    const { ethereum } = window as WindowType

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      })
      callback()
    } catch (e) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (e.code === 4902) {
        try {
          if (!RPC[targetNetwork]) throw Error()

          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [RPC[targetNetwork]],
          })
        } catch (addError) {
          console.error("Failed to add network to MetaMask")
        }
      }
      // handle other "switch" errors
    }
  }

export default requestNetworkChange
