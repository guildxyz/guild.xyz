import { Chains, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const getContractMethods = (abi) => {
  let parsedAbi
  try {
    parsedAbi = JSON.parse(abi)
  } catch (_) {
    // For some reason, "Contract source code not verified" message comes in the ABI property in this case
    throw new Error(abi)
  }

  return parsedAbi?.filter(
    (method) => method.type === "function" && method.stateMutability === "view"
  )
}

const fetchAbi = ([_, baseUrl, contract]) =>
  fetcher(
    `${baseUrl}/api?module=contract&action=getsourcecode&address=${contract}`
  ).then(async (res) => {
    if (res.status === "0") throw new Error(res.result)

    if (!res.result[0].Implementation) return getContractMethods(res.result[0].ABI)

    // Waiting 5s so we don't get rate-limited
    await new Promise((resolve) => setTimeout(resolve, 5000))

    return fetcher(
      `${baseUrl}/api?module=contract&action=getsourcecode&address=${res.result[0].Implementation}`
    ).then((implRes) => {
      if (implRes.status === "0") throw new Error(implRes.result)
      return getContractMethods(implRes.result[0].ABI)
    })
  })

const useAbi = (chain: Chains, address: string) =>
  useSWRImmutable(
    address ? ["getabi", RPC[chain ?? "ETHEREUM"].apiUrl, address] : null,
    fetchAbi
  )

export default useAbi
