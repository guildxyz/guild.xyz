import { ButtonProps, Icon, IconButton, Tooltip } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { PiTrash } from "react-icons/pi"

type Props = {
  label: string
  onClick: () => void
} & ButtonProps

const DeleteButton = ({ label, onClick }: PropsWithChildren<Props>): JSX.Element => (
  <Tooltip label={label}>
    <IconButton
      aria-label={label}
      icon={<Icon as={PiTrash} boxSize="1.1em" weight="bold" />}
      colorScheme="red"
      variant={"ghost"}
      minW={"44px"}
      borderRadius={"full"}
      onClick={onClick}
    />
  </Tooltip>
)

export default DeleteButton
