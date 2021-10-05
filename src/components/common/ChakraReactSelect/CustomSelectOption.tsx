import { HStack, Img, Text } from "@chakra-ui/react"

const CustomSelectOption = ({
  data,
  isDisabled,
  innerProps,
  isFocused,
}): JSX.Element => {
  if (isDisabled) return null

  return (
    <HStack
      px={4}
      py={1}
      width="full"
      transition="0.2s ease"
      cursor="pointer"
      color="white"
      bgColor={isFocused && "gray.600"}
      _hover={{ bgColor: "gray.600" }}
      {...innerProps}
    >
      {data.img && <Img boxSize={6} rounded="full" src={data.img} />}
      <Text fontWeight="semibold" as="span" isTruncated>
        {data.label}
      </Text>
    </HStack>
  )
}

export default CustomSelectOption
