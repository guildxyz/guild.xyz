import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import LensAction from "./components/LensAction"
import LensPostInput from "./components/LensPostInput"
import LensProfileSelect from "./components/LensProfileSelect"
import LensReact from "./components/LensReact"
import LensTotalInput from "./components/LensTotalInput"

const typeOptions = [
  {
    value: "LENS_PROFILE",
    label: "Have a LENS profile",
  },
  {
    value: "LENS_FOLLOW",
    label: "Follow a profile",
    LensRequirement: LensProfileSelect,
  },
  {
    value: "LENS_FOLLOWED_BY",
    label: "Be followed by",
    LensRequirement: LensProfileSelect,
  },
  {
    value: "LENS_REACT",
    label: "React on a post",
    LensRequirement: LensReact,
  },
  {
    value: "LENS_ACTION",
    label: "Lens activity",
    LensRequirement: LensAction,
  },
  {
    value: "LENS_COLLECT",
    label: "Collect a post",
    LensRequirement: LensPostInput,
  },
  {
    value: "LENS_TOTAL_FOLLOWERS",
    label: "Have at least [x] followers",
    LensRequirement: LensTotalInput,
  },
  {
    value: "LENS_TOTAL_POSTS",
    label: "Have at least [x] posts",
    LensRequirement: LensTotalInput,
  },
]

const LensForm = ({ baseFieldPath, field }: RequirementFormProps) => {
  const { resetField } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })
  const isEditMode = !!field?.id

  const selected = typeOptions.find((reqType) => reqType.value === type)

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl isRequired>
        <FormLabel>Type:</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{
            required: "This field is required.",
          }}
          options={typeOptions}
          placeholder="Choose type"
          afterOnChange={() => {
            resetField(`${baseFieldPath}.data.id`, undefined)
            resetField(`${baseFieldPath}.data.min`, undefined)
            resetField(`${baseFieldPath}.data.reaction`, undefined)
            resetField(`${baseFieldPath}.data.action`, undefined)
            resetField(`${baseFieldPath}.data.publishedOn`, undefined)
          }}
          isDisabled={isEditMode}
        />
      </FormControl>

      {selected?.LensRequirement && (
        <>
          <Divider />
          <selected.LensRequirement baseFieldPath={baseFieldPath} field={field} />
        </>
      )}
    </Stack>
  )
}

export default LensForm
