import { createInstance } from "dotbit"
import useSWRImmutable from "swr/immutable"

const fetchDotbitName = (_, dotbitResolver, domain) =>
  dotbitResolver.accountInfo(domain).then((res) => res.account_id_hex)

const dotbit = createInstance()

const useDotbitName = (domain: string) => {
  const shouldFetch = Boolean(dotbit && domain)

  return useSWRImmutable(
    shouldFetch ? ["dotbit", dotbit, domain] : null,
    fetchDotbitName
  )
}

export default useDotbitName

// test domain: "imac.bit"
// test address "0x5728088435fb8788472a9ca601fbc0b9cbea8be3"
