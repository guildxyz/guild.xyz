import { HStack, Text, useColorModeValue } from "@chakra-ui/react"
import { HTMLAttributes, PropsWithChildren } from "react"

type Props = {
  label: string
} & HTMLAttributes<HTMLElement>

const Suggestion = ({
  label,
  children,
  ...htmlAttributes
}: PropsWithChildren<Props>): JSX.Element => {
  const optionFocusBgColor = useColorModeValue("blackAlpha.100", "gray.600")

  return (
    <HStack
      {...htmlAttributes}
      px={4}
      h={10}
      minH={10}
      bgColor={htmlAttributes["aria-selected"] ? optionFocusBgColor : undefined}
      _hover={{
        bgColor: optionFocusBgColor,
      }}
      transition="0.16s ease"
    >
      <Text as="span" fontWeight="bold">
        {label}:
      </Text>
      {children}
    </HStack>
  )
}

export default Suggestion
