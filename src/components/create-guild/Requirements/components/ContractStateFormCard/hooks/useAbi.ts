import { Chains, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const fetchAbi = (url) =>
  fetcher(url).then((res) => {
    if (res.status === "0") throw new Error(res.result)

    const abi = JSON.parse(res.result)
    return abi?.filter(
      (method) => method.type === "function" && method.stateMutability === "view"
    )
  })

const useAbi = (chain: Chains, address: string) => {
  const explorerApiUrl = RPC[chain ?? "ETHEREUM"].blockExplorerUrls[0].replace(
    "https://",
    "https://api."
  )

  return useSWRImmutable(
    address
      ? `${explorerApiUrl}/api?module=contract&action=getabi&address=${address}`
      : null,
    fetchAbi
  )
}

export default useAbi
