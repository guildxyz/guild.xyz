import {
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import Switch from "components/common/Switch"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import SpaceSelect from "./SpaceSelect"

const proposalStateOptions: SelectOption[] = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Closed",
    value: "closed",
  },
]

const Proposals = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()

  const {
    field: {
      ref: minAmountFieldRef,
      name: minAmountFieldName,
      value: minAmountFieldValue,
      onChange: minAmountFieldOnChange,
      onBlur: minAmountFieldOnBlur,
    },
  } = useController({
    name: `${baseFieldPath}.data.minAmount`,
    rules: {
      required: "This field is required.",
      min: {
        value: 0,
        message: "Amount must be positive",
      },
    },
  })

  const {
    field: {
      ref: successfulOnlyFieldRef,
      name: successfulOnlyFieldName,
      value: successfulOnlyFieldValue,
      onChange: successfulOnlyFieldOnChange,
      onBlur: successfulOnlyFieldOnBlur,
    },
  } = useController({
    name: `${baseFieldPath}.data.successfulOnly`,
  })

  return (
    <>
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
      >
        <FormLabel>Number of proposals</FormLabel>

        <NumberInput
          ref={minAmountFieldRef}
          name={minAmountFieldName}
          value={minAmountFieldValue ?? ""}
          onChange={(newValue) => {
            const parsedValue = parseInt(newValue)
            minAmountFieldOnChange(isNaN(parsedValue) ? "" : parsedValue)
          }}
          onBlur={minAmountFieldOnBlur}
          min={0}
        >
          <NumberInputField placeholder="Minimum number" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.minAmount?.message}
        </FormErrorMessage>
      </FormControl>

      <SpaceSelect optional baseFieldPath={baseFieldPath} />

      <FormControl>
        <FormLabel>State</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.data.state`}
          options={proposalStateOptions}
          placeholder="Any state"
          isClearable
        />
      </FormControl>

      <FormControl>
        <FormLabel>Proposal filter</FormLabel>
        <Switch
          ref={successfulOnlyFieldRef}
          name={successfulOnlyFieldName}
          isChecked={successfulOnlyFieldValue}
          onChange={(e) => successfulOnlyFieldOnChange(e.target.checked)}
          onBlur={successfulOnlyFieldOnBlur}
          title="Successful only"
        />
      </FormControl>
    </>
  )
}

export default Proposals
