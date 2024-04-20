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
    label: "Mirror",
    value: "MIRROR",
  },
]

export const lensPlatformOptions: SelectOption[] = [
  {
    label: "Hey",
    value: "hey",
  },
  {
    label: "Orb",
    value: "orb",
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

    <FormControl>
      <FormLabel>Platform:</FormLabel>
      <ControlledSelect
        name={`${baseFieldPath}.data.publishedOn`}
        options={lensPlatformOptions}
      />
    </FormControl>
  </>
)

export default LensAction
