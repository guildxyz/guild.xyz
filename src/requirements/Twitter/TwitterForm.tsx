import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react"
import { ControlledCombobox } from "components/zag/Combobox"
import useGuild from "components/[guild]/hooks/useGuild"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import TwitterAccountAge from "./components/TwitterAccountAge"
import TwitterAccountAgeRelative from "./components/TwitterAccountAgeRelative"
import TwitterFollowerCount from "./components/TwitterFollowerCount"
import TwitterListInput from "./components/TwitterListInput"
import TwitterTextToInclude from "./components/TwitterTextToInclude"
import TwitterTweetInput from "./components/TwitterTweetInput"
import TwitterUserInput from "./components/TwitterUserInput"

const TwitterForm = ({ baseFieldPath, field }: RequirementFormProps) => {
  const { featureFlags } = useGuild()

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
    ...(featureFlags?.includes("TWITTER_EXTRA_REQUIREMENT")
      ? [
          {
            label: "Like tweet",
            value: "TWITTER_LIKE",
            TwitterRequirement: TwitterTweetInput,
          },
          {
            label: "Retweet tweet",
            value: "TWITTER_RETWEET",
            TwitterRequirement: TwitterTweetInput,
          },
        ]
      : []),
  ]

  const { errors } = useFormState()
  const { resetField } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })

  const selected = twitterRequirementTypes.find((reqType) => reqType.value === type)

  const resetFields = () => {
    resetField(`${baseFieldPath}.data.id`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.minAmount`, { defaultValue: "" })
  }

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledCombobox
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={twitterRequirementTypes}
          beforeOnChange={resetFields}
          placeholder="Select type"
          disableOptionFiltering
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
