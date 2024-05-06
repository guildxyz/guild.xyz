import {
  ButtonGroup,
  ButtonGroupProps,
  ButtonProps,
  Icon,
  Tooltip,
  UseRadioGroupProps,
  UseRadioProps,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react"
import Button from "./Button"

interface RadioButtonOptionProps {
  label?: string
  icon?: React.ElementType
  value: string
  disabled?: string
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
            {...(!!option.disabled && { onChange: () => {} })}
            colorScheme={chakraStyles?.colorScheme}
            borderRadius={buttonBorderRadius}
          />
        )
      })}
    </ButtonGroup>
  )
}

type RadioButtonProps = {
  colorScheme?: ButtonProps["colorScheme"]
  borderRadius?: ButtonProps["borderRadius"]
} & RadioButtonOptionProps &
  UseRadioProps

export const RadioButton = (props: RadioButtonProps & { disabled?: string }) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const {
    label,
    icon,
    isChecked,
    colorScheme = "indigo",
    borderRadius,
    disabled,
  } = props

  return (
    <Tooltip label={disabled} hasArrow>
      <Button
        leftIcon={icon && <Icon as={icon} boxSize={5} />}
        as="label"
        {...checkbox}
        boxShadow="none !important"
        cursor="pointer"
        borderRadius={borderRadius}
        w="full"
        colorScheme={isChecked ? colorScheme : "gray"}
        isDisabled={!!disabled}
      >
        <input {...input} />
        {label}
      </Button>
    </Tooltip>
  )
}

export default RadioButtonGroup
