import { IconButton, IconButtonProps } from "@chakra-ui/react"
import { X } from "phosphor-react"

const RemoveButton = (
  props: Omit<
    IconButtonProps,
    "aria-label" | "icon" | "rounded" | "boxSize" | "minW" | "minH" | "variant"
  >
) => (
  <IconButton
    aria-label="Remove"
    icon={<X />}
    rounded="full"
    boxSize={6}
    minW={6}
    minH={6}
    variant="unstyled"
    {...props}
  />
)

export default RemoveButton
