import { useWeb3React } from "@web3-react/core"
import { injected } from "connectors"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const useEagerConnect = (): boolean => {
  const router = useRouter()
  const { activate, active } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    if (router.pathname === "/") return
    injected
      .isAuthorized()
      .then((isAuthirozed) => isAuthirozed && activate(injected, undefined, true))
      .catch(() => setTried(true))
      .finally(() => setTried(true))
  }, [activate])

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}

export default useEagerConnect
