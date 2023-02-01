import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { CaretRight } from "phosphor-react"
import { PlatformName } from "types"
import ConnectWalletButton from "./ConnectWalletButton"

type Props = {
  onSelection: (platform: PlatformName) => void
}

const TelegramSelectButton = ({ onSelection }: Props) => {
  const { account } = useWeb3React()

  if (!account) return <ConnectWalletButton />

  return (
    <Button
      colorScheme="TELEGRAM"
      rightIcon={<CaretRight />}
      onClick={() => onSelection("TELEGRAM")}
    >
      Select group
    </Button>
  )
}

export default TelegramSelectButton
