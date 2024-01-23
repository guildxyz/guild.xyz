import {
  Button,
  ButtonGroup,
  ButtonGroupProps,
  ButtonProps,
  Icon,
  UseRadioGroupProps,
  UseRadioProps,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react"

interface RadioButtonOptionProps {
  label?: string
  icon?: React.ElementType
  isChecked?: boolean
  value: string
}

type RadioButtonGroupProps = {
  options: RadioButtonOptionProps[]
  chakraStyles?: ButtonGroupProps & ButtonProps
} & UseRadioGroupProps

const RadioButtonGroup = ({
  options,
  chakraStyles,
  ...useRadioGroupProps
}: RadioButtonGroupProps) => {
  const { getRootProps, getRadioProps } = useRadioGroup(useRadioGroupProps)

  const group = getRootProps()

  const buttonBorderRadius =
    chakraStyles?.borderRadius ??
    (() => {
      switch (chakraStyles?.size) {
        case "xs":
          return "md"
        case "sm":
        case "md":
          return "lg"
        case "lg":
        case "xl":
        case "2xl":
          return "xl"
        default:
          return "md"
      }
    })()

  return (
    <ButtonGroup {...chakraStyles} {...group}>
      {options.map((option) => {
        const radioProps = getRadioProps({ value: option.value })
        return (
          <RadioButton
            key={option.label}
            {...option}
            {...radioProps}
            colorScheme={chakraStyles?.colorScheme}
            borderRadius={buttonBorderRadius}
          />
        )
      })}
    </ButtonGroup>
  )
}

type RadioButtonProps = {
  colorScheme?: string
  borderRadius?: any
} & RadioButtonOptionProps &
  UseRadioProps
export const RadioButton = (props: RadioButtonProps) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { label, icon, isChecked, ...chakraStyles } = props
  const colorScheme = chakraStyles.colorScheme || "indigo"

  return (
    <Button
      leftIcon={icon && <Icon as={icon} boxSize={5} />}
      as="label"
      {...checkbox}
      boxShadow="none !important"
      cursor="pointer"
      borderRadius="lg"
      w="full"
      {...chakraStyles}
      colorScheme={isChecked ? colorScheme : "gray"}
    >
      <input {...input} />
      {label}
    </Button>
  )
}

export default RadioButtonGroup
