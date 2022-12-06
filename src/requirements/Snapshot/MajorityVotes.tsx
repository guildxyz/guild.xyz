import {
  FormControl,
  FormHelperText,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const MajorityVotes = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()

  const {
    field: {
      ref: minRatioFieldRef,
      name: minRatioFieldName,
      value: minRatioFieldValue,
      onChange: minRatioFieldOnChange,
      onBlur: minRatioFieldOnBlur,
    },
  } = useController({
    name: `${baseFieldPath}.data.minRatio`,
    rules: {
      required: "This field is required.",
      min: {
        value: 0,
        message: "Amount must be positive",
      },
      max: {
        value: 1,
        message: "Amount must be less than or equal to 1",
      },
    },
  })

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minRatio}
    >
      <FormLabel>Minimum ratio</FormLabel>

      <NumberInput
        ref={minRatioFieldRef}
        name={minRatioFieldName}
        value={minRatioFieldValue ?? ""}
        onChange={(newValue) => {
          if (/^[0-9]*\.0*$/i.test(newValue)) return minRatioFieldOnChange(newValue)
          const parsedValue = parseFloat(newValue)
          return minRatioFieldOnChange(isNaN(parsedValue) ? "" : parsedValue)
        }}
        onBlur={minRatioFieldOnBlur}
        min={0}
        max={1}
        step={0.01}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.minRatio?.message}
      </FormErrorMessage>

      <FormHelperText>A number between 0 and 1</FormHelperText>
    </FormControl>
  )
}

export default MajorityVotes
