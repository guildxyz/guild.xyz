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
import FollowerCount from "./components/FollowerCount"
import Following from "./components/Following"
import SearchValue from "./components/SearchValue"

const twitterRequirementTypes = [
  {
    label: "Follow somebody",
    value: "TWITTER_FOLLOW",
    TwitterRequirement: Following,
  },
  {
    label: "Number of followers",
    value: "TWITTER_FOLLOWER_COUNT",
    TwitterRequirement: FollowerCount,
  },
  {
    label: "Username includes text",
    value: "TWITTER_NAME",
    TwitterRequirement: SearchValue,
  },
  {
    label: "Bio includes text",
    value: "TWITTER_BIO",
    TwitterRequirement: SearchValue,
  },
]

const TwitterForm = ({ baseFieldPath, field }: RequirementFormProps) => {
  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `${baseFieldPath}.type`,
    rules: { required: "It's required to select a type" },
  })

  const { errors } = useFormState()

  const selected = twitterRequirementTypes.find((reqType) => reqType.value === value)

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>
        <StyledSelect
          options={twitterRequirementTypes}
          name={name}
          onBlur={onBlur}
          onChange={(newValue: { label: string; value: string }) =>
            onChange(newValue?.value ?? null)
          }
          ref={ref}
          value={selected}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.TwitterRequirement && (
        <>
          <Divider />
          <selected.TwitterRequirement baseFieldPath={baseFieldPath} field={field} />
        </>
      )}
    </Stack>
  )
}

export default TwitterForm
