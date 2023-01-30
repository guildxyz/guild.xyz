import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import FollowSince from "./components/FollowSince"
import MajorityVotes from "./components/MajorityVotes"
import Proposals from "./components/Proposals"
import SpaceInput from "./components/SpaceSelect"
import Strategy from "./components/Strategy"
import UserSince from "./components/UserSince"
import Votes from "./components/Votes"

const snapshotRequirementTypes = [
  {
    label: "Satisfy a strategy",
    value: "SNAPSHOT_STRATEGY",
    SnapshotRequirement: Strategy,
  },
  {
    label: "Be an admin of a space",
    value: "SNAPSHOT_SPACE_ADMIN",
    SnapshotRequirement: SpaceInput,
  },
  {
    label: "Be an author of a space",
    value: "SNAPSHOT_SPACE_AUTHOR",
    SnapshotRequirement: SpaceInput,
  },
  {
    label: "Follow a space",
    value: "SNAPSHOT_FOLLOW",
    SnapshotRequirement: SpaceInput,
  },
  {
    label: "Follow a space since",
    value: "SNAPSHOT_FOLLOW_SINCE",
    SnapshotRequirement: FollowSince,
  },
  {
    label: "Be a user since",
    value: "SNAPSHOT_USER_SINCE",
    SnapshotRequirement: UserSince,
  },
  {
    label: "Has voted [x] times",
    value: "SNAPSHOT_VOTES",
    SnapshotRequirement: Votes,
  },
  {
    label: "Made at least [x] proposals",
    value: "SNAPSHOT_PROPOSALS",
    SnapshotRequirement: Proposals,
  },
  {
    label: "Voted with the majority [x]% of the time",
    value: "SNAPSHOT_MAJORITY_VOTES",
    SnapshotRequirement: MajorityVotes,
  },
]

const SnapshotForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { resetField } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })

  const { errors } = useFormState()

  const selected = snapshotRequirementTypes.find((reqType) => reqType.value === type)

  return (
    <Stack spacing={4} alignItems="start" w="full">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={snapshotRequirementTypes}
          beforeOnChange={() =>
            resetField(`${baseFieldPath}.data`, { defaultValue: "" })
          }
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.SnapshotRequirement && (
        <>
          <Divider />
          <selected.SnapshotRequirement baseFieldPath={baseFieldPath} />
        </>
      )}
    </Stack>
  )
}

export default SnapshotForm
