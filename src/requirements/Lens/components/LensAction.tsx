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
  {
    label: "Phaver",
    value: "phaver",
  },
  {
    label: "Tape",
    value: "tape",
  },
  {
    label: "Buttrfly",
    value: "buttrfly",
  },
  {
    label: "BloomersTV",
    value: "bloomers.tv",
  },
  {
    label: "Kaira",
    value: "kaira",
  },
  {
    label: "Yup",
    value: "yup",
  },
  {
    label: "Orna",
    value: "orna.art",
  },
  {
    label: "Firefly",
    value: "firefly",
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
