import {
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
}

const MinAmountInput = ({ baseFieldPath }: Props): JSX.Element => {
  const { errors } = useFormState()
  const { control } = useFormContext()

  return (
    <FormControl
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
    >
      <FormLabel>Number of guilds</FormLabel>

      <Controller
        name={`${baseFieldPath}.data.minAmount` as const}
        control={control}
        rules={{
          min: {
            value: 0,
            message: "Amount must be positive",
          },
        }}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <NumberInput
            ref={ref}
            value={value ?? ""}
            onChange={(newValue) => {
              const parsedValue = parseInt(newValue)
              onChange(isNaN(parsedValue) ? "" : parsedValue)
            }}
            onBlur={onBlur}
            min={1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        )}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.minAmount?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default MinAmountInput
