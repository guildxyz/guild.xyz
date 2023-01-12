import { Icon, useRadio } from "@chakra-ui/react"
import Button from "components/common/Button"

const IsNegatedOption = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { label, icon, colorScheme, isChecked, ...rest } = props

  return (
    <Button
      leftIcon={icon && <Icon as={icon} boxSize={5} />}
      as="label"
      {...checkbox}
      boxShadow="none !important"
      variant={isChecked ? "subtle" : undefined}
      borderRadius="md"
      w="full"
      colorScheme={isChecked ? colorScheme : "gray"}
      cursor="pointer"
      {...rest}
    >
      <input {...input} />
      {label}
    </Button>
  )
}

export default IsNegatedOption
