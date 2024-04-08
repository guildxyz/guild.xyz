import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"

/**
 * The number input field must allow values with up to 4 decimal places (e.g.,
 * 0.0001). The step size for incrementing or decrementing values should
 * automatically adapt based on the least significant digit present in the value.
 * This adjustment ensures intuitive value changes for the user. Any input exceeding
 * 4 decimal places should be automatically rounded to the nearest value that
 * complies with the 4-decimal-place limit. The input of 0 is not allowed. Attempts
 * to enter 0 or to decrement the value below the minimum threshold should
 * automatically correct the value to 0.0001 or halt further decrementing to ensure
 * compliance with the field’s constraints.
 */
const ConversionNumberInput = ({
  value = "",
  isReadOnly = false,
  setValue,
  isDisabled = false,
}: {
  value: string
  isReadOnly?: boolean
  isDisabled?: boolean
  setValue: (val: string) => void
}) => {
  const [stepSize, setStepSize] = useState(1)

  const handleChange = (stringValue: string, numberValue: number) => {
    const parts = stringValue.split(".")

    if (parts?.[1] && parts[1].length > 4) {
      stringValue = Number(stringValue).toFixed(4).toString()
    }

    setValue(stringValue)
  }

  useEffect(() => {
    const parts = value.split(".")
    setStepSize(parts.length === 1 ? 1 : 1 / Math.pow(10, parts[1].length))
  }, [value])

  const handleBlur = () => {
    if (Number(value) === 0) {
      setValue("0.0001")
    }
  }

  return (
    <NumberInput
      w="full"
      value={value}
      onChange={handleChange}
      min={0.0001}
      step={stepSize}
      onBlur={handleBlur}
      isReadOnly={isReadOnly}
      isDisabled={isDisabled}
    >
      <NumberInputField pl="10" pr={0} cursor={isReadOnly && "default"} />
      <NumberInputStepper
        padding={"0 !important"}
        visibility={isReadOnly ? "hidden" : "visible"}
      >
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  )
}

export default ConversionNumberInput
