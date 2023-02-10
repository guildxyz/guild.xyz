import {
  InputGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useController, useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Format = "DAY" | "MONTH" | "YEAR"

const dayInMs = 86400000

const multipliers = {
  DAY: dayInMs,
  MONTH: dayInMs * 30,
  YEAR: dayInMs * 365,
}

type Props = {
  fieldName: string
  checkForTouched?: string
  isRequired?: boolean
}

const RelativeTimeInput = ({ fieldName, checkForTouched, isRequired }: Props) => {
  const { touchedFields } = useFormState()

  const [format, setFormat] = useState<"DAY" | "MONTH" | "YEAR">("DAY")

  const { field } = useController({
    name: fieldName,
    shouldUnregister: true,
    rules: isRequired && {
      validate: (value) => !isNaN(value) || "Invalid value.",
    },
  })

  useEffect(() => {
    if (checkForTouched && !parseFromObject(touchedFields, checkForTouched)) return
    field.onChange(multipliers[format])
  }, [format])

  return (
    <InputGroup>
      <NumberInput
        ref={field.ref}
        name={field.name}
        min={0}
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
        value={
          field.value && !isNaN(field.value) ? field.value / multipliers[format] : ""
        }
        onChange={(_, newValue) =>
          field.onChange(
            typeof newValue === "number" ? newValue * multipliers[format] : ""
          )
        }
      >
        <NumberInputField placeholder={!isRequired && "Optional"} />
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

export default RelativeTimeInput
