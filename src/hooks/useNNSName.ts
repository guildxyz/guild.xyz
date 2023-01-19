import { useWeb3React } from "@web3-react/core"
import { useState } from "react"

const useNNSName = async () => {
  const { provider } = useWeb3React()

  const TEST_ADDRESS = "0xE5358CaB95014E2306815743793F16c93a8a5C70"
  const NNS_REGISTRY = "0x3e1970dc478991b49c4327973ea8a4862ef5a4de"
  const [NNSName, setName] = useState("")
  if (provider && provider.network) {
    provider.network.ensAddress = NNS_REGISTRY
    await provider
      .lookupAddress(TEST_ADDRESS)
      .then((name) => {
        if (!name) return
        setName(name)
      })
      .catch((error) => {
        console.log(`error resolving reverse ens lookup: `, error)
      })
  }

  return NNSName
}

export default useNNSName
