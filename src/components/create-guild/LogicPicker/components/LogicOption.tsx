import { Box, Button, Icon, Tooltip, useRadio } from "@chakra-ui/react"

const LogicOption = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { value, icon, disabled = false, isChecked } = props

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
      colorScheme={isChecked ? "DISCORD" : "gray"}
      boxShadow="none !important"
      _active={isChecked ? { bg: null } : undefined}
      _hover={isChecked ? { bg: null } : undefined}
      cursor="pointer"
    >
      <input {...input} />
      {value}
    </Button>
  )
}

export default LogicOption
