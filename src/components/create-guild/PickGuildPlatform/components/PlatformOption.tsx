import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  Icon,
  Text,
  useRadio,
} from "@chakra-ui/react"

const PlatformOption = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { color, title, description, icon, isChecked, children } = props

  return (
    <Button
      as="fieldset"
      {...checkbox}
      w="full"
      h="auto"
      p="0"
      flexDir="column"
      alignItems="strech"
      borderRadius="none"
      _first={{ borderTopRadius: "xl" }}
      _last={{ borderBottomRadius: "xl" }}
      boxShadow="none !important"
      border="2px"
      bg={isChecked && `gray.700`}
      borderColor={isChecked ? `${color}.500` : "transparent"}
      _hover={{
        bg: isChecked ? null : "whiteAlpha.100",
      }}
      _active={{ bg: null }}
    >
      <Flex as="label" py="4" px="5" cursor="pointer" alignItems="center">
        <input {...input} />
        <Box whiteSpace="break-spaces" w="full">
          <Heading size="sm">{title}</Heading>
          <Text fontWeight="normal" colorScheme="gray" mt="1">
            {description}
          </Text>
        </Box>
        <Icon as={icon} width="1.2em" height="1.2em" ml="6" />
      </Flex>
      {children && <Collapse in={isChecked}>{children}</Collapse>}
    </Button>
  )
}

export default PlatformOption
