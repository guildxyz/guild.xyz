import {
  Alert,
  AlertDescription,
  AlertIcon,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
  chakra,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import TwitterAccountAge from "./components/TwitterAccountAge"
import TwitterAccountAgeRelative from "./components/TwitterAccountAgeRelative"
import TwitterAccountVerified from "./components/TwitterAccountVerified"
import TwitterListInput from "./components/TwitterListInput"
import TwitterMinimumCount from "./components/TwitterMinimumCount"
import TwitterTextToInclude from "./components/TwitterTextToInclude"
import TwitterTweetInput from "./components/TwitterTweetInput"
import TwitterUserInput from "./components/TwitterUserInput"

const twitterRequirementTypes = [
  {
    label: "Have verified account",
    value: "TWITTER_ACCOUNT_VERIFIED",
    TwitterRequirement: TwitterAccountVerified,
  },
  {
    label: "Have at least x followers",
    value: "TWITTER_FOLLOWER_COUNT",
    TwitterRequirement: TwitterMinimumCount,
  },
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
    label: "Like post",
    value: "TWITTER_LIKE_V2",
    TwitterRequirement: TwitterTweetInput,
  },
  {
    label: "Repost",
    value: "TWITTER_RETWEET_V2",
    TwitterRequirement: TwitterTweetInput,
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
  { label: "Have protected account", value: "TWITTER_ACCOUNT_PROTECTED" },
  {
    label: "Follow at least x users",
    value: "TWITTER_FOLLOWING_COUNT",
    TwitterRequirement: TwitterMinimumCount,
  },
  {
    label: "Have at least x posts",
    value: "TWITTER_TWEET_COUNT",
    TwitterRequirement: TwitterMinimumCount,
  },
  {
    label: "Give at least x total likes",
    value: "TWITTER_LIKE_COUNT",
    TwitterRequirement: TwitterMinimumCount,
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
    label: "Be a member of list",
    value: "TWITTER_LIST_MEMBER",
    TwitterRequirement: TwitterListInput,
  },
]

const TwitterForm = ({ baseFieldPath, field }: RequirementFormProps) => {
  const { errors } = useFormState()
  const { resetField } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })
  const isEditMode = !!field?.id

  const selected = twitterRequirementTypes.find((reqType) => reqType.value === type)

  const resetFields = () => {
    resetField(`${baseFieldPath}.data.id`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.minAmount`, { defaultValue: null })
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
          options={twitterRequirementTypes}
          beforeOnChange={resetFields}
          isDisabled={isEditMode}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.TwitterRequirement && (
        <>
          <Divider />
          {["TWITTER_RETWEET_V2", "TWITTER_LIKE_V2"].includes(type) && (
            <Alert>
              <AlertIcon />
              <AlertDescription>
                Due to limitations with X's API{" "}
                <chakra.span opacity={0.5}>(formerly Twitter)</chakra.span>, the
                requirement check may be inconsistent.
              </AlertDescription>
            </Alert>
          )}
          <selected.TwitterRequirement baseFieldPath={baseFieldPath} field={field} />
        </>
      )}
    </Stack>
  )
}

export default TwitterForm
