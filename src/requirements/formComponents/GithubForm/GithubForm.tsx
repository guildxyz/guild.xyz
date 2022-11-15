import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "types"
import parseFromObject from "utils/parseFromObject"
import GithubStar from "./components/GithubStar"

const githubRequirementTypes = [
  {
    label: "Star a repository",
    value: "GITHUB_STARRING",
    GithubRequirement: GithubStar,
  },
]

const GithubForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `${baseFieldPath}.type`,
    defaultValue: "GITHUB_STARRING",
    rules: { required: "It's required to select a type" },
  })

  const { errors } = useFormState()

  const selected = githubRequirementTypes.find((reqType) => reqType.value === value)

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>
        <StyledSelect
          options={githubRequirementTypes}
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

      {selected?.GithubRequirement && (
        <>
          <Divider />
          <selected.GithubRequirement baseFieldPath={baseFieldPath} />
        </>
      )}
    </Stack>
  )
}

export default GithubForm
