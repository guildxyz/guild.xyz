import { useWeb3React } from "@web3-react/core"
import { connectors, connectorsByName } from "connectors"
import { useEffect, useState } from "react"

const useEagerConnect = (): boolean => {
  const { isActive } = useWeb3React()

  const [tried, setTried] = useState(false)
  const [[metaMask], , [walletConnect], [gnosisSafe]] = connectors

  useEffect(() => {
    if (!metaMask || !gnosisSafe || !walletConnect) {
      return
    }

    const connector = localStorage.getItem("connector")
    if (!connector) {
      setTried(true)
      return
    }

    connectorsByName[connector].connectEagerly().finally(() => setTried(true))
  }, [metaMask, gnosisSafe, walletConnect])

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && isActive) {
      setTried(true)
    }
  }, [tried, isActive])

  return tried
}

export default useEagerConnect
