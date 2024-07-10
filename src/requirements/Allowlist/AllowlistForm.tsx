import { FormControl, FormLabel, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { StyledSelectProps } from "components/common/StyledSelect/StyledSelect"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements/types"
import parseFromObject from "utils/parseFromObject"
import AllowlistFormInputs from "./components/AllowlistFormInputs"

const allowListTypeOptions = [
  {
    label: "EVM and Fuel addresses",
    value: "ALLOWLIST",
  },
  {
    label: "Email addresses",
    value: "ALLOWLIST_EMAIL",
  },
] satisfies StyledSelectProps["options"]

const AllowlistForm = ({
  baseFieldPath,
  field,
}: RequirementFormProps): JSX.Element => {
  const {
    formState: { errors },
    resetField,
  } = useFormContext()
  const isEditMode = !!field?.id

  const resetFields = () => {
    resetField(`${baseFieldPath}.data.addresses`, { defaultValue: [] })
  }

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          defaultValue={"ALLOWLIST"}
          options={allowListTypeOptions}
          beforeOnChange={resetFields}
          isDisabled={isEditMode}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      <AllowlistFormInputs baseFieldPath={baseFieldPath} />
    </Stack>
  )
}

export default AllowlistForm
