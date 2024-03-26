import { walletSelectorModalAtom } from "components/_app/Web3ConnectionManager/components/WalletSelectorModal"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useSetAtom } from "jotai"
import { Wallet } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import ConnectAccount from "./ConnectAccount"

const WalletAuthButton = (): JSX.Element => {
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const { address } = useWeb3ConnectionManager()

  return (
    <ConnectAccount
      title="Sign in"
      isRequired
      icon={<Wallet />}
      isConnected={address && shortenHex(address, 3)}
      colorScheme="gray"
      onClick={() => setIsWalletSelectorModalOpen(true)}
    />
  )
}

export default WalletAuthButton
