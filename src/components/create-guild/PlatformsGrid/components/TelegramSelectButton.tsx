import Button from "components/common/Button"
import { CaretRight } from "phosphor-react"
import { PlatformName } from "types"

type Props = {
  onSelection: (platform: PlatformName) => void
}

const TelegramSelectButton = ({ onSelection }: Props) => (
  <Button
    colorScheme="TELEGRAM"
    rightIcon={<CaretRight />}
    onClick={() => onSelection("TELEGRAM")}
  >
    Next
  </Button>
)

export default TelegramSelectButton
