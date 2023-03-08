import { createInstance } from "dotbit"
import useSWRImmutable from "swr/immutable"

const fetchDotbitName = (_, dotbitResolver, account) =>
  dotbitResolver
    .accountById("0x5728088435fb8788472a9ca601fbc0b9cbea8be3")
    .then((res) => res.account)

const dotbit = createInstance()

const useDotbitName = (account: string) => {
  const shouldFetch = Boolean(dotbit && account)

  const { data } = useSWRImmutable(
    shouldFetch ? ["dotbit", dotbit, account] : null,
    fetchDotbitName
  )
  return data
}

export default useDotbitName

// test address "0x5728088435fb8788472a9ca601fbc0b9cbea8be3"
