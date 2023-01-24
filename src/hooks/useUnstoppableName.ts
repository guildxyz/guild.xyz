import Resolution from "@unstoppabledomains/resolution"
import { Chains, RPC } from "connectors"

const useUnstoppableName = () => {
  const ethereumProviderUrl = RPC[Chains[1]].rpcUrls[0]
  const polygonProviderUrl = RPC[Chains[137]].rpcUrls[0]

  // custom provider config using the Resolution constructor options
  const resolution = new Resolution({
    sourceConfig: {
      uns: {
        locations: {
          Layer1: {
            url: ethereumProviderUrl,
            network: "mainnet",
          },
          Layer2: {
            url: polygonProviderUrl,
            network: "polygon-mainnet",
          },
        },
      },
    },
  })

  resolution.addr("brad.crypto", "ETH").then(console.log).catch(console.log)

  return resolution
}
// 0x8aaD44321A86b170879d7A244c1e8d360c99DdA8
// resolve('brad.crypto', 'ETH');
export default useUnstoppableName
