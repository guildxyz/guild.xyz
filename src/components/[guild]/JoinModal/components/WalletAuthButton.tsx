import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Wallet } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import { useAccount } from "wagmi"
import ConnectAccount from "./ConnectAccount"

const WalletAuthButton = (): JSX.Element => {
  const { openWalletSelectorModal } = useWeb3ConnectionManager()
  const { address } = useAccount()

  return (
    <ConnectAccount
      account={address ? "Wallet" : "wallet"}
      isRequired
      icon={<Wallet />}
      isConnected={address && shortenHex(address, 3)}
      colorScheme="gray"
      onClick={openWalletSelectorModal}
    />
  )
}

export default WalletAuthButton
