import {
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import useGitcoinPassportScorers from "../hooks/useGitcoinPassportScorers"

const Score = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()

  const {
    field: {
      name: scorerFieldName,
      onBlur: scorerFieldOnBlur,
      onChange: scorerFieldOnChange,
      ref: scorerFieldRef,
      value: scorerFieldValue,
    },
  } = useController({
    name: `${baseFieldPath}.data.scorer`,
    rules: { required: "This field is required" },
  })

  const { scorers, isStampsLoading } = useGitcoinPassportScorers()

  const selected = scorers.find((stamp) => stamp.value === scorerFieldValue)

  const {
    field: {
      name: scoreFieldName,
      onBlur: scoreFieldOnBlur,
      onChange: scoreFieldOnChange,
      ref: scoreFieldRef,
      value: scoreFieldValue,
    },
  } = useController({
    name: `${baseFieldPath}.data.score`,
    rules: {
      required: "This field is required",
      min: {
        value: -1000000000,
        message: "Minimum score is -1000000000",
      },
      max: {
        value: 1000000000,
        message: "Maximum score is 1000000000",
      },
    },
  })

  return (
    <Stack spacing={4} alignItems="start" w="full">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.scorer}
      >
        <FormLabel>Scorer ID</FormLabel>

        <StyledSelect
          isClearable
          ref={scorerFieldRef}
          name={scorerFieldName}
          isLoading={isStampsLoading}
          isDisabled={isStampsLoading}
          options={scorers}
          onChange={(newValue: SelectOption) => scorerFieldOnChange(newValue?.value)}
          value={selected ?? ""}
          onBlur={scorerFieldOnBlur}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.scorer?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.score}>
        <FormLabel>Score</FormLabel>

        <NumberInput
          ref={scoreFieldRef}
          name={scoreFieldName}
          value={scoreFieldValue ?? undefined}
          onChange={scoreFieldOnChange}
          onBlur={scoreFieldOnBlur}
          min={-1000000000}
          max={1000000000}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.score?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default Score
