import {
  CloseButton,
  CloseButtonProps,
  forwardRef,
  useColorModeValue,
} from "@chakra-ui/react"

const RemoveRequirementButton = forwardRef(
  ({ onClick }: Pick<CloseButtonProps, "onClick">, ref) => {
    const bgColor = useColorModeValue("gray.700", "gray.400")

    return (
      <CloseButton
        ref={ref}
        position="absolute"
        top={2}
        right={2}
        color={bgColor}
        borderRadius="full"
        size="sm"
        onClick={onClick}
        aria-label="Remove requirement"
      />
    )
  }
)

export default RemoveRequirementButton
