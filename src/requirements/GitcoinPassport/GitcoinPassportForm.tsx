import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import Score from "./components/Score"
import Stamp from "./components/Stamp"

const gitcoinPassportRequirementTypes = [
  {
    label: "Have a Gitcoin Passport",
    value: "GITCOIN_PASS",
  },
  {
    label: "Have a stamp",
    value: "GITCOIN_STAMP",
    GitcoinPassportRequirement: Stamp,
  },
  {
    label: "Weighted Scorer",
    value: "GITCOIN_SCORE",
    GitcoinPassportRequirement: Score,
  },
]

const GitcoinPassportForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })

  const selected = gitcoinPassportRequirementTypes.find(
    (reqType) => reqType.value === type
  )

  const resetFields = () => {
    setValue(`${baseFieldPath}.data.id`, null)
    setValue(`${baseFieldPath}.data.stamp`, null)
    setValue(`${baseFieldPath}.data.score`, null)
  }

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={gitcoinPassportRequirementTypes}
          afterOnChange={resetFields}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.GitcoinPassportRequirement && (
        <>
          <Divider />
          <selected.GitcoinPassportRequirement baseFieldPath={baseFieldPath} />
        </>
      )}
    </Stack>
  )
}

export default GitcoinPassportForm
