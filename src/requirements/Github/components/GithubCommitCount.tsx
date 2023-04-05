import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import GithubAccountAge from "./GithubAccountAge"

const GithubCommitCount = ({ baseFieldPath }: RequirementFormProps) => {
  const { errors } = useFormState()

  const {
    field: { ref, value, onChange, onBlur },
  } = useController({
    name: `${baseFieldPath}.data.id`,
    rules: {
      required: "This field is required.",
      min: {
        value: 1,
        message: "Amount must be greater than 0",
      },
    },
  })

  return (
    <>
      <GithubAccountAge
        baseFieldPath={baseFieldPath}
        isMinAmountRequired={false}
        isMaxAmountRequired={false}
      />

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}
      >
        <FormLabel>Github commit count</FormLabel>

        <NumberInput
          ref={ref}
          value={value}
          onChange={(newValue) => {
            const parsedValue = parseInt(newValue)
            onChange(isNaN(parsedValue) ? "" : parsedValue)
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

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default GithubCommitCount
