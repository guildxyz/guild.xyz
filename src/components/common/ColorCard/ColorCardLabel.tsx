import { ChakraProps, HStack, Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props<LabelType extends string> = {
  type: LabelType
  backgroundColor: ChakraProps["color"]
  color?: ChakraProps["color"]
  label?: string
  fallbackColor?: ChakraProps["color"]
} & Rest

const ColorCardLabel = <LabelType extends string>({
  type,
  backgroundColor,
  color,
  label,
  children,
  fallbackColor = "blackAlpha.600",
  ...rest
}: PropsWithChildren<Props<LabelType>>): JSX.Element => (
  <HStack
    spacing={0}
    position="absolute"
    h={7}
    overflow="hidden"
    alignItems="stretch"
    {...rest}
  >
    {children}
    <Text
      as="span"
      px={4}
      py={1}
      backgroundColor={backgroundColor}
      color={color || fallbackColor}
      fontSize="sm"
      fontWeight="extrabold"
      borderTopLeftRadius="xl"
    >
      {label ?? type}
    </Text>
  </HStack>
)

export default ColorCardLabel
