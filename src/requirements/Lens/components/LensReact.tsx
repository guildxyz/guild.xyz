import { FormControl, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import LensPostInput from "./LensPostInput"

export type LensReaction = "ANY" | "UPVOTE" | "DOWNVOTE"
const reactionOptions: SelectOption<LensReaction>[] = [
  {
    label: "Any",
    value: "ANY",
  },
  {
    label: "Upvote",
    value: "UPVOTE",
  },
  {
    label: "Downvote",
    value: "DOWNVOTE",
  },
]

const LensReact = ({ baseFieldPath, field }: RequirementFormProps) => (
  <>
    <LensPostInput {...{ baseFieldPath, field }} />

    <FormControl isRequired>
      <FormLabel>Reaction type:</FormLabel>
      <ControlledSelect
        name={`${baseFieldPath}.data.reaction`}
        options={reactionOptions}
      />
    </FormControl>
  </>
)

export default LensReact
