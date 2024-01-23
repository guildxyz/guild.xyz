import {
  Button,
  ButtonGroup,
  ButtonGroupProps,
  Icon,
  UseRadioGroupProps,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react"

interface RadioButtonProps {
  label?: string
  icon?: React.ElementType
  isChecked?: boolean
  value: string
}

interface RadioButtonGroupProps {
  radioGroupProps: UseRadioGroupProps
  options: RadioButtonProps[]
  renderOption?: (option: RadioButtonProps, radioProps: any) => JSX.Element
  buttonGroupStyleProps?: ButtonGroupProps
}

const RadioButtonGroup = (props: RadioButtonGroupProps) => {
  const { getRootProps, getRadioProps } = useRadioGroup(props.radioGroupProps)

  const group = getRootProps()

  const renderButton = (option, radioProps) => {
    if (props.renderOption) return props.renderOption(option, radioProps)
    return <RadioButton {...option} {...radioProps}></RadioButton>
  }

  return (
    <ButtonGroup {...props.buttonGroupStyleProps} {...group}>
      {props.options.map((option) => {
        const radioProps = getRadioProps({ value: option.value })
        return renderButton(option, radioProps)
      })}
    </ButtonGroup>
  )
}

export const RadioButton = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { label, icon, isChecked, ...rest } = props

  return (
    <Button
      leftIcon={icon && <Icon as={icon} boxSize={5} />}
      as="label"
      {...checkbox}
      boxShadow="none !important"
      colorScheme={isChecked ? "indigo" : "gray"}
      cursor="pointer"
      {...rest}
    >
      <input {...input} />
      {label}
    </Button>
  )
}

export default RadioButtonGroup
