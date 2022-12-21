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
        value: 0.01,
        message: "Amount must be greater than 0",
      },
      max: {
        value: 1,
        message: "Amount must be less than or equal to 100",
      },
    },
  })

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minRatio}
    >
      <FormLabel>Minimum percentage</FormLabel>

      <NumberInput
        ref={minRatioFieldRef}
        name={minRatioFieldName}
        value={minRatioFieldValue ? minRatioFieldValue * 100 : ""}
        onChange={(newValue) => {
          const parsedValue = parseFloat(newValue)
          return minRatioFieldOnChange(isNaN(parsedValue) ? "" : parsedValue / 100)
        }}
        onBlur={minRatioFieldOnBlur}
        min={0}
        max={100}
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
    </FormControl>
  )
}

export default MajorityVotes
