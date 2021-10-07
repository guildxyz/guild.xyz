import { Box, Button, Icon, Tooltip, useColorMode, useRadio } from "@chakra-ui/react"

const LogicOption = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { value, icon, disabled = false, isChecked } = props

  const { colorMode } = useColorMode()

  if (disabled)
    return (
      <Tooltip label="Coming soon">
        <Box>
          <Button leftIcon={<Icon as={icon} boxSize={5} />} disabled w="full">
            {value}
          </Button>
        </Box>
      </Tooltip>
    )

  return (
    <Button
      leftIcon={<Icon as={icon} boxSize={5} />}
      as="label"
      {...checkbox}
      boxShadow="none !important"
      colorScheme={isChecked ? "indigo" : "gray"}
      variant={colorMode === "light" ? "ghost" : "solid"}
      color={colorMode === "light" ? (isChecked && "white") || "black" : "white"}
      bgColor={
        colorMode === "light"
          ? (isChecked && "indigo.500") || "blackAlpha.200"
          : undefined
      }
      _active={isChecked ? { bg: null } : undefined}
      _hover={
        colorMode === "light"
          ? (isChecked && { bg: null }) || { bg: "blackAlpha.100" }
          : (isChecked && { bg: null }) || { bg: "whiteAlpha.100" }
      }
      cursor="pointer"
    >
      <input {...input} />
      {value}
    </Button>
  )
}

export default LogicOption
