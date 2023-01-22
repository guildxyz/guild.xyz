import Button from "components/common/Button"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Wallet } from "phosphor-react"

const ConnectWalletButton = (): JSX.Element => {
  const { openWalletSelectorModal } = useWeb3ConnectionManager()

  return (
    <Button leftIcon={<Wallet />} onClick={openWalletSelectorModal}>
      Connect Wallet
    </Button>
  )
}

export default ConnectWalletButton
