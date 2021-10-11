import { HStack, Img, Text, useColorMode } from "@chakra-ui/react"

const CustomSelectOption = ({
  data,
  isDisabled,
  innerProps,
  isFocused,
}): JSX.Element => {
  const { colorMode } = useColorMode()

  if (isDisabled) return null

  return (
    <HStack
      px={4}
      py={1}
      width="full"
      transition="0.2s ease"
      cursor="pointer"
      color={colorMode === "light" ? "black" : "white"}
      bgColor={
        colorMode === "light"
          ? (isFocused && "blackAlpha.100") || undefined
          : (isFocused && "gray.600") || undefined
      }
      _hover={{ bgColor: colorMode === "light" ? "blackAlpha.100" : "gray.600" }}
      {...innerProps}
    >
      {data.img && (
        <Img boxSize={6} minW={6} minH={6} rounded="full" src={data.img} />
      )}
      <Text fontWeight="semibold" as="span" isTruncated>
        {data.label}
      </Text>
    </HStack>
  )
}

export default CustomSelectOption
