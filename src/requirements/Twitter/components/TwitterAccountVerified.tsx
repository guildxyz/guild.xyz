import { FormControl, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"

type ValueType = "any" | "blue" | "business" | "government"

const options: SelectOption<ValueType>[] = [
  {
    label: "One of them",
    value: "any",
  },
  {
    label: "Blue",
    value: "blue",
  },
  {
    label: "Business",
    value: "business",
  },
  {
    label: "Government",
    value: "government",
  },
]

const TwitterAccountVerified = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext()
  const defaultValue: ValueType = "any"

  return (
    <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath)?.type}>
      <FormLabel>Verification type</FormLabel>

      <ControlledSelect
        defaultValue={defaultValue}
        name="SelectedTwitterVerification"
        options={options}
        onChange={({ value }: { value: ValueType }) => {
          setValue("SelectedTwitterVerification", value)
          setValue(`${baseFieldPath}.data.id`, value === "any" ? undefined : value)
        }}
      />
    </FormControl>
  )
}
export default TwitterAccountVerified
