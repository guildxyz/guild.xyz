import Resolution from "@unstoppabledomains/resolution"
import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr/immutable"

const fetchUnstoppableName = (_, account, resolution) =>
  resolution.reverse(account).then((res) => res)

const resolution = new Resolution()

const useUnstoppableDomainName = () => {
  const { account } = useWeb3React()
  const shouldFetch = Boolean(resolution && account)

  const { data } = useSWRImmutable(
    shouldFetch ? ["unstoppableDomain", account, resolution] : null,
    fetchUnstoppableName
  )
  return data
}

export default useUnstoppableDomainName

// test address "0x94ef5300cbc0aa600a821ccbc561b057e456ab23"
