import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
} from "@chakra-ui/react"
import { useController } from "react-hook-form"

type Props = {
  numberFormat?: "INT" | "FLOAT"
} & NumberInputProps

const ControlledNumberInput = ({
  numberFormat = "INT",
  ...props
}: Props): JSX.Element => {
  const {
    field: { ref, name, value, onChange, onBlur },
  } = useController({
    name: props.name,
    rules: {
      required: props.isRequired && "This field is required",
      min: props.min && {
        value: props.min,
        message: `Minimum: ${props.min}`,
      },
      max: props.max && {
        value: props.max,
        message: `Maximum: ${props.max}`,
      },
    },
  })

  const handleChange = (newValue) => {
    if (/^[0-9]*\.0*$/i.test(newValue)) return onChange(newValue)
    const parsedValue =
      numberFormat === "INT" ? parseInt(newValue) : parseFloat(newValue)
    return onChange(isNaN(parsedValue) ? "" : parsedValue)
  }

  return (
    <NumberInput
      {...props}
      ref={ref}
      name={name}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  )
}

export default ControlledNumberInput
