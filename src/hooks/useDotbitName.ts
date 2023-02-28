import { useWeb3React } from "@web3-react/core"
import { createInstance } from "dotbit"
import useSWRImmutable from "swr/immutable"

const fetchDotbitName = (_, dotbitResolver, account) =>
  dotbitResolver.accountById(account).then((res) => res.account)

const dotbit = createInstance()

const useDotbitName = () => {
  const { account } = useWeb3React()

  const shouldFetch = Boolean(dotbit && account)

  const { data } = useSWRImmutable(
    shouldFetch ? ["dotbit", dotbit, account] : null,
    fetchDotbitName
  )
  return data
}

export default useDotbitName

// test address "0x5728088435fb8788472a9ca601fbc0b9cbea8be3"
