import { useWeb3React } from "@web3-react/core"
import { connectors } from "connectors"
import { useEffect, useState } from "react"

const useEagerConnect = (): boolean => {
  const { isActive } = useWeb3React()

  const [tried, setTried] = useState(false)
  const [[metaMask], , [walletConnectV2]] = connectors

  useEffect(() => {
    metaMask
      .connectEagerly()
      .catch(() => setTried(true))
      .finally(() => setTried(true))
  }, [metaMask])

  useEffect(() => {
    walletConnectV2
      .connectEagerly()
      .catch(() => setTried(true))
      .finally(() => setTried(true))
  }, [walletConnectV2])

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && isActive) {
      setTried(true)
    }
  }, [tried, isActive])

  return tried
}

export default useEagerConnect
