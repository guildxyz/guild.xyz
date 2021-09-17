import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { injected } from "connectors"
import { useEffect } from "react"

type WindowType = Window & typeof globalThis & { ethereum: Web3Provider }

const useInactiveListener = (suppress = false): void => {
  const { active, activate } = useWeb3React()

  useEffect((): any => {
    const { ethereum } = window as WindowType

    if (ethereum && ethereum.on && !active && !suppress) {
      const handleChainChanged = (_chainId: string | number) => {
        activate(injected).catch((err) => {
          console.error("Failed to activate after chain changed", err)
        })
      }
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          activate(injected).catch((err) => {
            console.error("Failed to activate after accounts changed", err)
          })
        }
      }

      ethereum.on("chainChanged", handleChainChanged)
      ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged)
          ethereum.removeListener("accountsChanged", handleAccountsChanged)
        }
      }
    }
  }, [active, suppress, activate])
}

export default useInactiveListener
