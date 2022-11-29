import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { useController, useFormState } from "react-hook-form"
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
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `${baseFieldPath}.type`,
    rules: { required: "It's required to select a type" },
  })

  const { errors } = useFormState()

  const selected = gitcoinPassportRequirementTypes.find(
    (reqType) => reqType.value === value
  )

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>
        <StyledSelect
          options={gitcoinPassportRequirementTypes}
          name={name}
          onBlur={onBlur}
          onChange={(newValue: { label: string; value: string }) => {
            onChange(newValue?.value)
          }}
          ref={ref}
          value={selected}
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
