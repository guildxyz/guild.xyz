import { BigNumber } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"

const useCoinBalance = () => {
  const { account, provider } = useWeb3React()
  const fallbackValue = BigNumber.from(0)

  const [balance, setBalance] = useState(fallbackValue)

  useEffect(() => {
    ;(async () => {
      const fetchedBalance = await provider
        ?.getBalance(account)
        .then((res) => res)
        .catch(() => fallbackValue)

      setBalance(fetchedBalance)
    })()
  }, [account, provider])

  return balance
}

export default useCoinBalance
