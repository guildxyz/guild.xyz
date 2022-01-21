import { Flex, HStack, Img, Text, useColorMode } from "@chakra-ui/react"

const CustomSelectOption = ({
  data,
  isDisabled,
  innerProps,
  isFocused,
}): JSX.Element => {
  /**
   * Removing the mouse event handlers because those are really bad for performance
   * and a simple CSS hover is enough for us. Source:
   * https://github.com/JedWatson/react-select/issues/3128
   */
  const { onMouseMove, onMouseOver, ...filteredInnerProps } = innerProps

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
      {...filteredInnerProps}
    >
      {data.img && (
        <Img
          boxSize={5}
          minW={5}
          minH={5}
          rounded={data.img.includes(".svg") ? "none" : "full"}
          src={data.img}
        />
      )}
      <Flex width="full" maxW="calc(100% - 1.75rem)" justifyContent="space-between">
        <Text fontWeight="semibold" as="span" isTruncated>
          {data.label}
        </Text>
        {data.details && (
          <Text
            as="span"
            colorScheme="gray"
            ml="auto"
            pl={1}
            width="max-content"
            minW="max-content"
            fontSize="sm"
            fontWeight="semibold"
            isTruncated
          >
            {data.details}
          </Text>
        )}
      </Flex>
    </HStack>
  )
}

export default CustomSelectOption
