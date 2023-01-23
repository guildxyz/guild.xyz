import { useWeb3React } from "@web3-react/core"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Wallet } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import ConnectAccount from "./ConnectAccount"

const WalletAuthButton = (): JSX.Element => {
  const { openWalletSelectorModal } = useWeb3ConnectionManager()
  const { account } = useWeb3React()

  return (
    <ConnectAccount
      account={account ? "Wallet" : "wallet"}
      isRequired
      icon={<Wallet />}
      isConnected={account && shortenHex(account, 3)}
      colorScheme="gray"
      onClick={openWalletSelectorModal}
    />
  )
}

export default WalletAuthButton
