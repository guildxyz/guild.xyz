import { useWeb3React } from "@web3-react/core"
import { createInstance } from "dotbit"
import useSWRImmutable from "swr/immutable"

const fetchNameCoinName = (_, dotbit, account) =>
  dotbit
    .accountById("0x5728088435fb8788472a9ca601fbc0b9cbea8be3")
    .then((r) => console.log(r.account)) // return this

const useNameCoinName = async () => {
  const { account } = useWeb3React()

  const dotbit = createInstance()
  const shouldFetch = dotbit && account

  const { data } = useSWRImmutable(
    shouldFetch ? ["NameCoin", dotbit, account] : null,
    fetchNameCoinName
  )

  return data
}

export default useNameCoinName
