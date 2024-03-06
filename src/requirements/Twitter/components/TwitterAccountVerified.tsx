import {
  Alert,
  AlertDescription,
  AlertIcon,
  FormControl,
  FormLabel,
  chakra,
} from "@chakra-ui/react"
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
    <>
      <Alert status="info">
        <AlertIcon />
        <AlertDescription>
          X <chakra.span opacity={0.5}>(formerly Twitter)</chakra.span>{" "}
          authentication limits to about 450 requests every 15 minutes. Users may
          need to wait if this threshold is exceeded.
        </AlertDescription>
      </Alert>
      <FormControl isRequired>
        <FormLabel>Verification type</FormLabel>
        <ControlledSelect
          defaultValue={defaultValue}
          name={`${baseFieldPath}.data.id`}
          options={options}
        />
      </FormControl>
    </>
  )
}
export default TwitterAccountVerified
