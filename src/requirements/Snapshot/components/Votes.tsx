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
import ProposalSelect from "./ProposalSelect"
import SpaceSelect from "./SpaceSelect"

const Votes = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
      >
        <FormLabel>Number of votes</FormLabel>

        <Controller
          name={`${baseFieldPath}.data.minAmount` as const}
          control={control}
          rules={{
            required: "This field is required.",
            min: {
              value: 1,
              message: "Amount must be greater than or equal to 1",
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

      <SpaceSelect
        baseFieldPath={baseFieldPath}
        helperText="Assigned automatically if you select a proposal"
        optional
      />

      <ProposalSelect baseFieldPath={baseFieldPath} />
    </>
  )
}

export default Votes
