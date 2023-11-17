import { Collapse, Tooltip } from "@chakra-ui/react"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"

const ConnectWalletButton = (): JSX.Element => {
  const { openWalletSelectorModal, type, isWeb3Connected } =
    useWeb3ConnectionManager()

  return (
    <Collapse in={type !== "EVM"}>
      <Tooltip
        label="Disconnect your Fuel wallet first"
        isDisabled={!isWeb3Connected}
        hasArrow
      >
        <Button
          size="lg"
          colorScheme="blue"
          onClick={openWalletSelectorModal}
          isDisabled={isWeb3Connected}
          w="full"
        >
          Connect wallet
        </Button>
      </Tooltip>
    </Collapse>
  )
}

export default ConnectWalletButton
