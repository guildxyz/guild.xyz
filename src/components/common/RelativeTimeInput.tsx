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
import pluralize from "utils/pluralize"

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
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    rules: props.isRequired && {
      validate: (newValue) => {
        if (!newValue || isNaN(newValue)) return "Invalid value."

        return true
      },
    },
  })

  return (
    <RelativeTimeInput
      ref={ref}
      name={name}
      value={value}
      onChange={(_, newValue) => onChange(isNaN(newValue) ? undefined : newValue)}
      onBlur={onBlur}
      {...props}
    />
  )
}

const RelativeTimeInput = forwardRef(
  (props: NumberInputProps, ref: any): JSX.Element => {
    const [value, setValue] = useState<number>(
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      !isNaN(Number(props.value)) ? Number(props.value) : undefined
    )
    const [format, setFormat] = useState<Format>("DAY")

    const displayValue = value && !isNaN(value) ? value / multipliers[format] : ""

    return (
      <InputGroup>
        <NumberInput
          ref={ref}
          {...props}
          value={displayValue}
          onChange={(_, valueAsNumber) => {
            const newValue =
              typeof valueAsNumber === "number" && !isNaN(valueAsNumber)
                ? valueAsNumber * multipliers[format]
                : undefined
            // @ts-expect-error TODO: fix this error originating from strictNullChecks
            setValue(newValue)
            // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
          min={props.min && props.min / multipliers[format]}
          max={props.max && props.max / multipliers[format]}
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
          <option value="DAY">
            {pluralize(Number(displayValue), "Day", false)}
          </option>
          <option value="MONTH">
            {pluralize(Number(displayValue), "Month", false)}
          </option>
          <option value="YEAR">
            {pluralize(Number(displayValue), "Year", false)}
          </option>
        </Select>
      </InputGroup>
    )
  }
)

export { ControlledRelativeTimeInput, RelativeTimeInput }
