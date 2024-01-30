import { FormControl, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import MinMaxAmount from "requirements/common/MinMaxAmount"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"

const txTypeOptions: SelectOption[] = [
  {
    label: "Mint",
    value: "mint",
  },
  {
    label: "Script",
    value: "script",
  },
  {
    label: "Create",
    value: "create",
  },
]

const FuelTransactions = ({ baseFieldPath, field }: RequirementFormProps) => {
  const { errors } = useFormState()

  return (
    <>
      <FormControl>
        <FormLabel>Transaction type</FormLabel>
        <ControlledSelect
          name={`${baseFieldPath}.data.id`}
          options={txTypeOptions}
          placeholder="Any transaction type"
          isClearable
        />
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>

      <MinMaxAmount field={field} baseFieldPath={baseFieldPath} />
    </>
  )
}
export default FuelTransactions
