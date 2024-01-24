import { FormControl, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"

const options: SelectOption[] = [
  {
    label: "One of them",
    value: "all",
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

const TwitterVerificationSelect = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath)?.type}>
      <FormLabel>Verification type</FormLabel>

      <ControlledSelect
        defaultValue="all"
        name="SelectedTwitterVerification"
        options={options}
        onChange={({ value }) => {
          setValue("SelectedTwitterVerification", value)
          setValue(
            `${baseFieldPath}.data.id`,
            value === "NotVerified" ? undefined : value
          )
        }}
      />
    </FormControl>
  )
}
export default TwitterVerificationSelect
