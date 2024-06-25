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
  value: string
  label?: string | JSX.Element
  icon?: React.ElementType
  colorScheme?: string
  tooltipLabel?: string
  isDisabled?: boolean
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
            key={option.value}
            colorScheme={chakraStyles?.colorScheme}
            {...option}
            {...radioProps}
            {...(!!option.isDisabled && { onChange: () => {} })}
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

export const RadioButton = (props: RadioButtonProps & { isDisabled?: boolean }) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const {
    label,
    icon,
    isChecked,
    tooltipLabel,
    colorScheme = "indigo",
    borderRadius,
    isDisabled,
  } = props

  return (
    <Tooltip label={tooltipLabel} hasArrow>
      <Button
        leftIcon={icon && <Icon as={icon} boxSize={5} />}
        as="label"
        {...checkbox}
        boxShadow="none !important"
        cursor="pointer"
        borderRadius={borderRadius}
        w="full"
        colorScheme={isChecked ? colorScheme : "gray"}
        isDisabled={!!isDisabled}
      >
        <input {...input} />
        {label}
      </Button>
    </Tooltip>
  )
}

export default RadioButtonGroup
