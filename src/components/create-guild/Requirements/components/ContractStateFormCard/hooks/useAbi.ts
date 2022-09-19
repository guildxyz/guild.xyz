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

const useAbi = (chain: Chains, address: string) =>
  useSWRImmutable(
    address
      ? `${
          RPC[chain ?? "ETHEREUM"].apiUrl
        }/api?module=contract&action=getabi&address=${address}`
      : null,
    fetchAbi
  )

export default useAbi
