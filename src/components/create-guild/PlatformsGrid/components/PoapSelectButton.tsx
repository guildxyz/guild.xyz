import { Button } from "@chakra-ui/react"
import { CaretRight } from "phosphor-react"
import { PlatformName } from "types"

type Props = {
  onSelection: (platform: PlatformName) => void
}

const PoapSelectButton = ({ onSelection }: Props) => (
  <Button
    onClick={() => onSelection("POAP")}
    rightIcon={<CaretRight />}
    colorScheme="purple"
  >
    Set POAP
  </Button>
)

export default PoapSelectButton
