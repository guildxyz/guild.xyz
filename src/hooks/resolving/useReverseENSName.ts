// import { useWeb3React } from "@web3-react/core"

const fetchENSName = ([_, provider, domain]) => provider.resolveName(domain)

// WAGMI TODO
const useReverseENSName = (domain: string) => {
  // const { provider } = useWeb3React()
  // const shouldFetch = Boolean(provider)

  // const { data } = useSWRImmutable(
  //   shouldFetch ? ["ENS", provider, domain] : null,
  //   fetchENSName
  // )

  // return data
  return null
}

export default useReverseENSName
