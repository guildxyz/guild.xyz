import { CHAIN_CONFIG } from "wagmiConfig/chains"
import fetcher from "./fetcher"

export const getBlockByTime = ([_, chain, timestamp]) => {
  if (!CHAIN_CONFIG[chain].etherscanApiUrl) throw new Error("Unsupported chain")

  return fetcher(
    `${CHAIN_CONFIG[chain].etherscanApiUrl}/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before`
  ).then((json) => {
    if (json.status !== "1")
      throw new Error("Rate limited, will try again in 5 seconds")
    if (json.message.includes("NOTOK")) throw new Error(json.result)

    /**
     * The Etherscan API isn't consistent on every chain, the actual block number is
     * sometimes in result.blockNumber, sometimes in result.
     */
    return json?.result?.blockNumber ?? json?.result
  })
}
