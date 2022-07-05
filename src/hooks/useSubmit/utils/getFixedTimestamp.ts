import { JsonRpcProvider } from "@ethersproject/providers"
import { RPC } from "connectors"

const TIMESTAMP_CHECK_INTERVAL_MIN = 10
const EXCLUDE_CHAINS: Set<keyof typeof RPC> = new Set(["RINKEBY", "GNOSIS", "CELO"])
const RPC_URLS = Object.entries(RPC)
  .filter(([chain]) => !EXCLUDE_CHAINS.has(chain as keyof typeof RPC))
  .map(
    ([
      ,
      {
        rpcUrls: [rpcUrl],
      },
    ]) => rpcUrl
  )

// Try to fetch timestamp from the picked chains
const getFixedTimestamp = () => Promise.any(RPC_URLS.map(getTimestampOfLatestBlock))

const getTimestampOfLatestBlock = async (rpcUrl: string) => {
  const systemTimestamp = Date.now()
  const provider = new JsonRpcProvider(rpcUrl)
  const blockNumber = await provider.getBlockNumber()

  const blockTimestamp = await provider
    .getBlock(blockNumber)
    .then((block) => block.timestamp * 1000)

  if (
    blockTimestamp > systemTimestamp + 1000 * 60 * TIMESTAMP_CHECK_INTERVAL_MIN ||
    blockTimestamp < systemTimestamp - 1000 * 60 * TIMESTAMP_CHECK_INTERVAL_MIN
  ) {
    return blockTimestamp.toString()
  }

  return systemTimestamp.toString()
}

export default getFixedTimestamp
