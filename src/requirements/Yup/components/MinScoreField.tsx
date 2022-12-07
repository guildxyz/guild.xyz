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
import { Controller, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const MinScoreField = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
    >
      <FormLabel>Minimum score</FormLabel>

      <Controller
        name={`${baseFieldPath}.data.minAmount` as const}
        control={control}
        rules={{
          required: "This field is required.",
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
              if (/^[0-9]*\.0*$/i.test(newValue)) return onChange(newValue)
              const parsedValue = parseFloat(newValue)
              return onChange(isNaN(parsedValue) ? "" : parsedValue)
            }}
            onBlur={onBlur}
            min={0}
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

export default MinScoreField
