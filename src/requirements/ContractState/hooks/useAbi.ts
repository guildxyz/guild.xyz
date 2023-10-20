import { Chains, etherscanApiUrls } from "connectors"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const getContractMethods = (abi) => {
  let parsedAbi
  try {
    parsedAbi = JSON.parse(abi)
  } catch (_) {}

  return (
    parsedAbi?.filter(
      (method) =>
        method.type === "function" &&
        (method.stateMutability === "view" ||
          method.stateMutability === "pure" ||
          method.constant)
    ) ?? []
  )
}

const fetchAbi = ([_, baseUrl, contract]) => {
  if (!baseUrl) return []

  return fetcher(
    `${baseUrl}/api?module=contract&action=getsourcecode&address=${contract}`
  )
    .then(async (res) => {
      if (!res.result?.[0]?.Implementation)
        return getContractMethods(res.result?.[0]?.ABI)

      // Waiting 5s so we don't get rate-limited
      await new Promise((resolve) => setTimeout(resolve, 5000))

      return fetcher(
        `${baseUrl}/api?module=contract&action=getsourcecode&address=${res.result?.[0]?.Implementation}`
      ).then((implRes) => getContractMethods(implRes.result?.[0]?.ABI))
    })
    .catch(() => [])
}

const useAbi = (chain: Chains, address: string) => {
  const baseUrl = etherscanApiUrls[chain ?? "ETHEREUM"]
  return useSWRImmutable<any[]>(
    address ? ["getabi", baseUrl, address] : null,
    fetchAbi
  )
}

export default useAbi
