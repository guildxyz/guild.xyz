import { FormControl, FormLabel, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import FarcasterCastHash from "./components/FarcasterCastHash"
import FarcasterChannel from "./components/FarcasterChannel"
import FarcasterTextToInclude from "./components/FarcasterTextToInclude"
import FarcasterTotalFollowers from "./components/FarcasterTotalFollowers"
import FarcasterUser from "./components/FarcasterUser"

const typeOptions = [
  {
    value: "FARCASTER_PROFILE",
    label: "Have a Farcaster profile",
  },
  {
    value: "FARCASTER_TOTAL_FOLLOWERS",
    label: "Have at least [x] followers",
  },
  {
    value: "FARCASTER_FOLLOW",
    label: "Follow a profile",
  },
  {
    value: "FARCASTER_FOLLOW_CHANNEL",
    label: "Follow a channel",
  },
  {
    value: "FARCASTER_FOLLOWED_BY",
    label: "Be followed by",
  },
  {
    value: "FARCASTER_LIKE",
    label: "Like a cast",
  },
  {
    value: "FARCASTER_RECAST",
    label: "Recast a cast",
  },
  {
    value: "FARCASTER_USERNAME",
    label: "Have specific text in username",
  },
  {
    value: "FARCASTER_BIO",
    label: "Have specific text in bio",
  },
]

const FarcasterForm = ({ baseFieldPath, field }: RequirementFormProps) => {
  const { resetField } = useFormContext()
  const type = useWatch({ name: `${baseFieldPath}.type` })

  const resetForm = () => {
    resetField(`${baseFieldPath}.data.min`)
    resetField(`${baseFieldPath}.data.id`)
    resetField(`${baseFieldPath}.data.hash`)
  }

  const isEditMode = !!field?.id

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
          afterOnChange={resetForm}
          isDisabled={isEditMode}
        />
      </FormControl>

      {type === "FARCASTER_TOTAL_FOLLOWERS" && (
        <FarcasterTotalFollowers baseFieldPath={baseFieldPath} />
      )}

      {["FARCASTER_FOLLOW", "FARCASTER_FOLLOWED_BY"].includes(type) && (
        <FarcasterUser baseFieldPath={baseFieldPath} />
      )}

      {type === "FARCASTER_FOLLOW_CHANNEL" && (
        <FarcasterChannel baseFieldPath={baseFieldPath} />
      )}

      {["FARCASTER_LIKE", "FARCASTER_RECAST"].includes(type) && (
        <FarcasterCastHash baseFieldPath={baseFieldPath} />
      )}

      {["FARCASTER_BIO", "FARCASTER_USERNAME"].includes(type) && (
        <FarcasterTextToInclude baseFieldPath={baseFieldPath} />
      )}
    </Stack>
  )
}

export default FarcasterForm
