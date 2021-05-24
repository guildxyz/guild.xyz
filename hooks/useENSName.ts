import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"

const useENSName = (address: string): string => {
  const { library, chainId } = useWeb3React<Web3Provider>()
  const [ENSName, setENSName] = useState("")

  useEffect(() => {
    if (library && typeof address === "string") {
      let stale = false

      library
        .lookupAddress(address)
        .then((name) => {
          if (!stale && typeof name === "string") {
            setENSName(name)
          }
        })
        .catch(() => {})

      return () => {
        stale = true
        setENSName("")
      }
    }
    return undefined
  }, [library, address, chainId])

  return ENSName
}

export default useENSName
