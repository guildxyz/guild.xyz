import { useState } from "react"
import { useAccount } from "wagmi"

const useEagerConnect = (): boolean => {
  const { isConnected } = useAccount()

  const [tried, setTried] = useState(false)
  // WAGMI TODO: do we actually need this?
  // const [[metaMask], , [walletConnect], [gnosisSafe]] = connectors

  // useEffect(() => {
  //   if (!metaMask || !gnosisSafe || !walletConnect) {
  //     return
  //   }

  //   const connector = (gnosisSafe as any)?.inIframe
  //     ? "gnosis"
  //     : localStorage.getItem("connector")

  //   if (!connector) {
  //     setTried(true)
  //     return
  //   }

  //   connectorsByName[connector].connectEagerly().finally(() => setTried(true))
  // }, [metaMask, gnosisSafe, walletConnect])

  // // if the connection worked, wait until we get confirmation of that to flip the flag
  // useEffect(() => {
  //   if (!tried && isConnected) {
  //     setTried(true)
  //   }
  // }, [tried, isConnected])

  return tried
}

export default useEagerConnect
