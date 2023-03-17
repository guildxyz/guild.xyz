import Resolution from "@unstoppabledomains/resolution"
import useSWRImmutable from "swr/immutable"

const fetchUnstoppableName = (_, domain, resolution) =>
  resolution.resolver(domain).then((res) => res)

const resolution = new Resolution()

const useReverseUnstoppableDomain = (domain: string) => {
  const shouldFetch = Boolean(resolution && domain)

  return useSWRImmutable(
    shouldFetch ? ["unstoppableDomain", domain, resolution] : null,
    fetchUnstoppableName
  )
}

export default useReverseUnstoppableDomain

// test domain: "ladyinred.x"
// test address "0x94ef5300cbc0aa600a821ccbc561b057e456ab23"
