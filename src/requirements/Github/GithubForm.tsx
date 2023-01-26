import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
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
  const type = useWatch({ name: `${baseFieldPath}.type` })

  const { errors } = useFormState()

  const selected = githubRequirementTypes.find((reqType) => reqType.value === type)

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={githubRequirementTypes}
          defaultValue="GITHUB_STARRING"
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
