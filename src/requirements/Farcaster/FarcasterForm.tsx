import { FormControl, FormLabel, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import FarcasterCastHash from "./components/FarcasterCastHash"
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
]

const FarcasterForm = ({ baseFieldPath }: RequirementFormProps) => {
  const type = useWatch({ name: `${baseFieldPath}.type` })

  const resetForm = () => {
    // TODO
  }

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
        />
      </FormControl>

      {type === "FARCASTER_TOTAL_FOLLOWERS" && (
        <FarcasterTotalFollowers baseFieldPath={baseFieldPath} />
      )}

      {["FARCASTER_FOLLOW", "FARCASTER_FOLLOWED_BY"].includes(type) && (
        <FarcasterUser baseFieldPath={baseFieldPath} />
      )}

      {["FARCASTER_LIKE", "FARCASTER_RECAST"].includes(type) && (
        <FarcasterCastHash baseFieldPath={baseFieldPath} />
      )}
    </Stack>
  )
}

export default FarcasterForm
