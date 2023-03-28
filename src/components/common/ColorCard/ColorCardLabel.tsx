import { ChakraProps, HStack, Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props<LabelType extends string> = {
  type?: LabelType
  backgroundColor?: ChakraProps["color"]
  color?: ChakraProps["color"]
  label?: string
  labelSize?: string
  fallbackColor?: ChakraProps["color"]
} & Rest

const ColorCardLabel = <LabelType extends string>({
  type,
  backgroundColor,
  color,
  label,
  labelSize = "sm",
  children,
  fallbackColor = "blackAlpha.700",
  ...rest
}: PropsWithChildren<Props<LabelType>>): JSX.Element => (
  <HStack
    position="absolute"
    overflow="hidden"
    backgroundColor={backgroundColor}
    color={color || fallbackColor}
    px={4}
    py={1}
    {...rest}
  >
    {children}
    <Text
      as="span"
      fontSize={labelSize}
      fontWeight="extrabold"
      borderTopLeftRadius="xl"
    >
      {label ?? type}
    </Text>
  </HStack>
)

export default ColorCardLabel
