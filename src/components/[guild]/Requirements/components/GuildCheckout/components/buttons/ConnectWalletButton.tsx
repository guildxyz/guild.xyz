import Button from "components/common/Button"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"

const ConnectWalletButton = (): JSX.Element => {
  const { openWalletSelectorModal } = useWeb3ConnectionManager()

  return (
    <Button
      size="lg"
      colorScheme="blue"
      onClick={openWalletSelectorModal}
      w="full"
      data-dd-action-name="ConnectWalletButton (GuildCheckout)"
    >
      Connect wallet
    </Button>
  )
}

export default ConnectWalletButton
