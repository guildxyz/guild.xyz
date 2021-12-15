import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  Icon,
  Tag,
  Text,
  useColorMode,
  useRadio,
} from "@chakra-ui/react"

const PlatformOption = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const {
    color,
    title,
    description,
    icon,
    disabled = false,
    isChecked,
    children,
  } = props

  const { colorMode } = useColorMode()

  if (disabled)
    return (
      <Button
        as="fieldset"
        w="full"
        h="auto"
        p="0"
        flexDir="column"
        alignItems="strech"
        borderRadius="none"
        _first={{ borderTopRadius: "xl" }}
        _last={{ borderBottomRadius: "xl" }}
        boxShadow="none !important"
        _active={{ bg: null }}
        disabled
      >
        <Flex as="label" py="4" px="5" alignItems="center">
          <Box whiteSpace="break-spaces" w="full">
            <Heading size="sm">
              {title}
              <Tag colorScheme="gray" size="sm" ml="3" mt="-1px">
                {disabled}
              </Tag>
            </Heading>
            <Text fontWeight="normal" colorScheme="gray" mt="1">
              {description}
            </Text>
          </Box>
          <Icon as={icon} width="1.2em" height="1.2em" ml="6" />
        </Flex>
      </Button>
    )

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
      bg={
        colorMode === "light"
          ? (isChecked && "indigo.50") || "white"
          : (isChecked && "gray.700") || null
      }
      borderColor={isChecked ? `${color}.500` : "transparent"}
      _hover={{
        bg: isChecked
          ? null
          : colorMode === "light"
          ? "blackAlpha.50"
          : "whiteAlpha.100",
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
