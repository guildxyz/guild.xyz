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
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minTimes}
      >
        <FormLabel>Number of votes</FormLabel>

        <Controller
          name={`${baseFieldPath}.data.minTimes` as const}
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
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.minTimes?.message}
        </FormErrorMessage>
      </FormControl>

      <ProposalSelect baseFieldPath={baseFieldPath} />

      <SpaceSelect
        baseFieldPath={baseFieldPath}
        helperText="Assigned automatically"
        isDisabled
        optional
      />
    </>
  )
}

export default Votes
