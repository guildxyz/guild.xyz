import { Icon, IconButton } from "@chakra-ui/react"
import Close from "static/icons/close.svg"
import { Rest } from "types"

type Props = {
  onClick: () => void
} & Rest

const CloseButton = ({ onClick, ...rest }: Props): JSX.Element => (
  <IconButton
    aria-label="Close"
    variant="ghost"
    size="sm"
    onClick={onClick}
    isRound
    icon={<Icon as={Close} />}
    {...rest}
  />
)

export default CloseButton
