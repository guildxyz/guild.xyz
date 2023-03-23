import {
  InputGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
  Select,
} from "@chakra-ui/react"
import { forwardRef, useState } from "react"
import { useController } from "react-hook-form"

type Format = "DAY" | "MONTH" | "YEAR"

const dayInMs = 86400000

const multipliers = {
  DAY: dayInMs,
  MONTH: dayInMs * 30,
  YEAR: dayInMs * 365,
}

type Props = {
  fieldName: string
} & NumberInputProps

const ControlledRelativeTimeInput = ({ fieldName, ...props }: Props) => {
  const {
    field: { ref, name, value, onChange, onBlur },
  } = useController({
    name: fieldName,
    rules: props.isRequired && {
      validate: (newValue) => !isNaN(newValue) || "Invalid value.",
    },
  })

  return (
    <RelativeTimeInput
      ref={ref}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      {...props}
    />
  )
}

const RelativeTimeInput = forwardRef(
  (props: NumberInputProps, ref: any): JSX.Element => {
    const [value, setValue] = useState<number>(
      !isNaN(Number(props.value)) ? Number(props.value) : undefined
    )
    const [format, setFormat] = useState<"DAY" | "MONTH" | "YEAR">("DAY")

    return (
      <InputGroup>
        <NumberInput
          ref={ref}
          {...props}
          value={value && !isNaN(value) ? value / multipliers[format] : ""}
          onChange={(_, valueAsNumber) => {
            const newValue =
              typeof valueAsNumber === "number" && !isNaN(valueAsNumber)
                ? valueAsNumber * multipliers[format]
                : undefined
            setValue(newValue)
            props.onChange?.(newValue?.toString(), newValue)
          }}
          sx={{
            "> input": {
              borderRightRadius: 0,
            },
            "div div:first-of-type": {
              borderTopRightRadius: 0,
            },
            "div div:last-of-type": {
              borderBottomRightRadius: 0,
            },
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <Select
          borderLeftRadius={0}
          maxW={32}
          value={format}
          onChange={(e) => setFormat(e.target.value as Format)}
        >
          <option value="DAY">Day</option>
          <option value="MONTH">Month</option>
          <option value="YEAR">Year</option>
        </Select>
      </InputGroup>
    )
  }
)

export default ControlledRelativeTimeInput
export { RelativeTimeInput }
