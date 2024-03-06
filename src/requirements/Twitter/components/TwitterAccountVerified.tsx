import { FormControl, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"

type ValueType = "any" | "blue" | "business" | "government"

const options: SelectOption<ValueType>[] = [
  {
    label: "Any",
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
  const defaultValue: ValueType = "any"

  return (
    <FormControl isRequired>
      <FormLabel>Verification type</FormLabel>
      <ControlledSelect
        defaultValue={defaultValue}
        name={`${baseFieldPath}.data.id`}
        options={options}
      />
    </FormControl>
  )
}
export default TwitterAccountVerified
