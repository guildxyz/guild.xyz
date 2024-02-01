import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
  forwardRef,
} from "@chakra-ui/react"

const Number = forwardRef<NumberInputProps, "input">((props, ref) => (
  <NumberInput ref={ref} {...props} value={props.value ?? ""}>
    <NumberInputField />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
))

export default Number
