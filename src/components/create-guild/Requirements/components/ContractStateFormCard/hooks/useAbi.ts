import { Chains, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const fetchAbi = (_: string, baseUrl: string, contract: string) =>
  fetcher(
    `${baseUrl}/api?module=contract&action=getsourcecode&address=${contract}`
  ).then(async (res) => {
    if (res.status === "0") throw new Error(res.result)

    if (!res.result[0].Implementation) {
      const abi = JSON.parse(res.result[0].ABI)

      return abi?.filter(
        (method) => method.type === "function" && method.stateMutability === "view"
      )
    }

    // Waiting 5s so we don't get rate-limited
    await new Promise((resolve) => setTimeout(resolve, 5000))

    return fetcher(
      `${baseUrl}/api?module=contract&action=getsourcecode&address=${res.result[0].Implementation}`
    ).then((implRes) => {
      if (implRes.status === "0") throw new Error(implRes.result)

      const implAbi = JSON.parse(implRes.result[0].ABI)

      return implAbi?.filter(
        (method) => method.type === "function" && method.stateMutability === "view"
      )
    })
  })

const useAbi = (chain: Chains, address: string) =>
  useSWRImmutable(
    address ? ["getabi", RPC[chain ?? "ETHEREUM"].apiUrl, address] : null,
    fetchAbi
  )

export default useAbi
