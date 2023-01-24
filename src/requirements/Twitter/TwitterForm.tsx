import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { useController, useFormContext, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import TwitterAccountAge from "./components/TwitterAccountAge"
import TwitterAccountAgeRelative from "./components/TwitterAccountAgeRelative"
import TwitterFollowerCount from "./components/TwitterFollowerCount"
import TwitterListInput from "./components/TwitterListInput"
import TwitterTextToInclude from "./components/TwitterTextToInclude"
import TwitterUserInput from "./components/TwitterUserInput"

const twitterRequirementTypes = [
  {
    label: "Follow user",
    value: "TWITTER_FOLLOW",
    TwitterRequirement: TwitterUserInput,
  },
  {
    label: "Be followed by user",
    value: "TWITTER_FOLLOWED_BY",
    TwitterRequirement: TwitterUserInput,
  },
  // {
  //   label: "Like tweet",
  //   value: "TWITTER_LIKE",
  //   TwitterRequirement: TwitterTweetInput,
  // },
  // {
  //   label: "Retweet tweet",
  //   value: "TWITTER_RETWEET",
  //   TwitterRequirement: TwitterTweetInput,
  // },
  {
    label: "Follow list",
    value: "TWITTER_LIST_FOLLOW",
    TwitterRequirement: TwitterListInput,
  },
  {
    label: "Be a member of list",
    value: "TWITTER_LIST_MEMBER",
    TwitterRequirement: TwitterListInput,
  },
  {
    label: "Have at least x followers",
    value: "TWITTER_FOLLOWER_COUNT",
    TwitterRequirement: TwitterFollowerCount,
  },
  {
    label: "Have specific text in username",
    value: "TWITTER_NAME",
    TwitterRequirement: TwitterTextToInclude,
  },
  {
    label: "Have specific text in bio",
    value: "TWITTER_BIO",
    TwitterRequirement: TwitterTextToInclude,
  },
  {
    label: "Account age (absolute)",
    value: "TWITTER_ACCOUNT_AGE",
    TwitterRequirement: TwitterAccountAge,
  },
  {
    label: "Account age (relative)",
    value: "TWITTER_ACCOUNT_AGE_RELATIVE",
    TwitterRequirement: TwitterAccountAgeRelative,
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
  const { setValue } = useFormContext()

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
          onChange={(newValue: { label: string; value: string }) => {
            onChange(newValue?.value ?? null)
            setValue(`${baseFieldPath}.data`, "")
          }}
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
