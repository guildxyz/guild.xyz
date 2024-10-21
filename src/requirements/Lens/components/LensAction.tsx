import { FormControl, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { RequirementFormProps } from "requirements/types"
import { actionOptions, lensPlatformOptions } from "../constants"
import LensPostInput from "./LensPostInput"

const LensAction = ({ baseFieldPath, field }: RequirementFormProps) => (
  <>
    <LensPostInput {...{ baseFieldPath, field }} />

    <FormControl isRequired>
      <FormLabel>Action:</FormLabel>
      <ControlledSelect
        name={`${baseFieldPath}.data.action`}
        options={actionOptions}
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
