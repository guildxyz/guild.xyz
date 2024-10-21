import { FormControl, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { RequirementFormProps } from "requirements/types"
import { reactionOptions } from "../constants"
import LensPostInput from "./LensPostInput"

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
