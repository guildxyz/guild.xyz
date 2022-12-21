import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useController, useFormContext, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import FollowSince from "./components/FollowSince"
import Proposals from "./components/Proposals"
import SpaceInput from "./components/SpaceSelect"
import Strategy from "./components/Strategy"
import UserSince from "./components/UserSince"
import Votes from "./components/Votes"
import MajorityVotes from "./MajorityVotes"

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

  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `${baseFieldPath}.type`,
    rules: { required: "It's required to select a type" },
  })

  const { errors } = useFormState()

  const selected = snapshotRequirementTypes.find(
    (reqType) => reqType.value === value
  )

  const resetFields = () => {
    resetField(`${baseFieldPath}.data.block`)
    resetField(`${baseFieldPath}.data.strategies`)
    resetField(`${baseFieldPath}.data.space`)
    resetField(`${baseFieldPath}.data.since`)
    resetField(`${baseFieldPath}.data.minTimes`)
    resetField(`${baseFieldPath}.data.proposal`)
    resetField(`${baseFieldPath}.data.minAmount`)
    resetField(`${baseFieldPath}.data.state`)
    resetField(`${baseFieldPath}.data.successfulOnly`)
    resetField(`${baseFieldPath}.data.minRatio`)
  }

  return (
    <Stack spacing={4} alignItems="start" w="full">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>
        <StyledSelect
          options={snapshotRequirementTypes}
          name={name}
          onBlur={onBlur}
          onChange={(newValue: { label: string; value: string }) => {
            resetFields()
            onChange(newValue?.value)
          }}
          ref={ref}
          value={selected}
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
