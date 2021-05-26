import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useETHBalance from "../hooks/useETHBalance"

const ETHBalance = (): JSX.Element => {
  const { account } = useWeb3React<Web3Provider>()
  const { data } = useETHBalance(account)

  return <p>Balance: Ξ{data}</p>
}

export default ETHBalance
