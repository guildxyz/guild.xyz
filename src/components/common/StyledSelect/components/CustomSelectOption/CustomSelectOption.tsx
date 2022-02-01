import { Flex, Text, useColorModeValue } from "@chakra-ui/react"
import OptionImage from "./components/OptionImage"

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

  const focusedBg = useColorModeValue("blackAlpha.100", "gray.600")

  if (isDisabled) return null

  return (
    <Flex
      px={4}
      py={2}
      width="full"
      alignItems={"center"}
      cursor="pointer"
      transition="0.2s ease"
      bgColor={isFocused ? focusedBg : undefined}
      _hover={{ bgColor: focusedBg }}
      title={data.label}
      {...filteredInnerProps}
    >
      {data.img && <OptionImage img={data.img} alt={data.label} mr="2" />}
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
  )
}

export default CustomSelectOption
