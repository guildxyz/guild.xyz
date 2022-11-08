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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onMouseMove, onMouseOver, ...filteredInnerProps } = innerProps

  const focusedBg = useColorModeValue("blackAlpha.100", "gray.600")

  return (
    <Flex
      px={4}
      py={2}
      width="full"
      alignItems={"center"}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      transition="0.2s ease"
      bgColor={isFocused ? focusedBg : undefined}
      _hover={!isDisabled && { bgColor: focusedBg }}
      title={data.label}
      opacity={isDisabled && ".3"}
      {...filteredInnerProps}
    >
      {data.img &&
        (typeof data.img === "string" ? (
          <OptionImage img={data.img} alt={data.label} mr="2" />
        ) : (
          data.img
        ))}
      <Text fontWeight="semibold" as="span" noOfLines={1}>
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
          noOfLines={1}
        >
          {data.details}
        </Text>
      )}
    </Flex>
  )
}

export default CustomSelectOption
