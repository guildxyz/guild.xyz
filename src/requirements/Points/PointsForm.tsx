import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import PointsAmount from "./components/PointsAmount"
import PointsRank from "./components/PointsRank"
import PointsTotalAmount from "./components/PointsTotalAmount"

const pointRequirementTypes = [
  {
    label: "Have at least x points",
    value: "POINTS_AMOUNT",
    PointsRequirement: PointsAmount,
  },
  {
    label: "Have a total score of x summing all points",
    value: "POINTS_TOTAL_AMOUNT",
    PointsRequirement: PointsTotalAmount,
  },
  {
    label: "Be in the first x in leaderboard",
    value: "POINTS_RANK",
    PointsRequirement: PointsRank,
  },
]

const PointsForm = ({ baseFieldPath, field }: RequirementFormProps): JSX.Element => {
  const { id } = useGuild()

  const type = useWatch({ name: `${baseFieldPath}.type` })
  const isEditMode = !!field?.id

  const { errors } = useFormState()
  useController({
    name: `${baseFieldPath}.data.guildId`,
    defaultValue: id,
  })

  const selected = pointRequirementTypes.find((reqType) => reqType.value === type)

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={pointRequirementTypes}
          isDisabled={isEditMode}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.PointsRequirement && (
        <>
          <Divider />
          <selected.PointsRequirement baseFieldPath={baseFieldPath} field={field} />
        </>
      )}
    </Stack>
  )
}

export default PointsForm
