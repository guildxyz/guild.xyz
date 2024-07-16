import { IconButton, IconButtonProps } from "@chakra-ui/react"
import { X } from "@phosphor-icons/react"

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
    boxSize={5}
    minW={5}
    minH={5}
    variant="unstyled"
    display="flex"
    alignItems="center"
    opacity={0.7}
    _hover={{ opacity: 1 }}
    {...props}
  />
)

export default RemoveButton
