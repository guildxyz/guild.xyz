import { FormControl, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import LensPostInput from "./LensPostInput"

export type LensActionType = "MIRROR" | "COMMENT" | "QUOTE"
const reactionOptions: SelectOption<LensActionType>[] = [
  {
    label: "Comment",
    value: "COMMENT",
  },
  {
    label: "Quote",
    value: "QUOTE",
  },
  {
    label: "Downvote",
    value: "MIRROR",
  },
]

const LensAction = ({ baseFieldPath, field }: RequirementFormProps) => (
  <>
    <LensPostInput {...{ baseFieldPath, field }} />

    <FormControl isRequired>
      <FormLabel>Action:</FormLabel>
      <ControlledSelect
        name={`${baseFieldPath}.data.action`}
        options={reactionOptions}
      />
    </FormControl>
  </>
)

export default LensAction
