import { Icon, useColorMode, useRadio } from "@chakra-ui/react"
import Button from "components/common/Button"

const IsNegatedOption = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { label, icon, isChecked, ...rest } = props

  const { colorMode } = useColorMode()

  // if (disabled)
  //   return (
  //     <Tooltip label="Coming soon">
  //       <Box>
  //         <Button
  //           leftIcon={<Icon as={icon} boxSize={5} />}
  //           disabled
  //           w="full"
  //           data-dd-action-name={value}
  //         >
  //           {value}
  //         </Button>
  //       </Box>
  //     </Tooltip>
  //   )

  return (
    <Button
      leftIcon={icon && <Icon as={icon} boxSize={5} />}
      as="label"
      {...checkbox}
      boxShadow="none !important"
      colorScheme={isChecked ? "indigo" : "gray"}
      _active={isChecked ? { bg: null } : undefined}
      _hover={isChecked ? { bg: null } : undefined}
      cursor="pointer"
      {...rest}
    >
      <input {...input} />
      {label}
    </Button>
  )
}

export default IsNegatedOption
