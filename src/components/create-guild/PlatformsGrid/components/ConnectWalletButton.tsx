import Button from "components/common/Button"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { Wallet } from "phosphor-react"
import { useContext } from "react"

const ConnectWalletButton = (): JSX.Element => {
  const { openWalletSelectorModal } = useContext(Web3Connection)

  return (
    <Button leftIcon={<Wallet />} onClick={openWalletSelectorModal}>
      Connect Wallet
    </Button>
  )
}

export default ConnectWalletButton
