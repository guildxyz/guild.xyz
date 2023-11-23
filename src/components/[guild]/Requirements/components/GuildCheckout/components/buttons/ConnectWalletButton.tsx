import { Collapse } from "@chakra-ui/react"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import { useAccount } from "wagmi"

const ConnectWalletButton = (): JSX.Element => {
  const { isConnected } = useAccount()
  const { openWalletSelectorModal } = useWeb3ConnectionManager()

  return (
    <Collapse in={!isConnected}>
      <Button
        size="lg"
        colorScheme="blue"
        onClick={openWalletSelectorModal}
        isDisabled={isConnected}
        w="full"
      >
        Connect wallet
      </Button>
    </Collapse>
  )
}

export default ConnectWalletButton
