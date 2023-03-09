import { Button } from "@chakra-ui/react"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Wallet } from "phosphor-react"

const ConnectWalletButton = () => {
  const { openWalletSelectorModal } = useWeb3ConnectionManager()

  return (
    <Button leftIcon={<Wallet />} onClick={openWalletSelectorModal} h="10">
      Connect
    </Button>
  )
}

export default ConnectWalletButton
