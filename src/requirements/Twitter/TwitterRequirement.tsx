import { Icon, Text } from "@chakra-ui/react"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import DataBlockWithDate from "components/[guild]/Requirements/components/DataBlockWithDate"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import DataBlockWithCopy from "components/common/DataBlockWithCopy"
import { TwitterLogo } from "phosphor-react"
import useSWRImmutable from "swr/immutable"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import TwitterListLink from "./components/TwitterListLink"
import TwitterTweetLink from "./components/TwitterTweetLink"
import TwitterUserLink from "./components/TwitterUserLink"

// https://help.twitter.com/en/managing-your-account/twitter-username-rules
export const TWITTER_HANDLE_REGEX = /^[a-z0-9_]+$/i

const TwitterRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { data: twitterAvatar } = useSWRImmutable(
    requirement.data.id && TWITTER_HANDLE_REGEX.test(requirement.data.id)
      ? `/v2/third-party/twitter/users/${requirement.data.id}/avatar`
      : null
  )

  return (
    <Requirement
      image={
        (["TWITTER_FOLLOW", "TWITTER_FOLLOWED_BY"].includes(requirement.type) &&
          twitterAvatar) || <Icon as={TwitterLogo} boxSize={6} />
      }
      footer={<ConnectRequirementPlatformButton />}
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "TWITTER_NAME":
            return (
              <>
                <Text as="span">{`Have "`}</Text>
                <DataBlockWithCopy text={requirement.data.id} />
                <Text as="span">{`" in your Twitter username`}</Text>
              </>
            )
          case "TWITTER_BIO":
            return (
              <>
                <Text as="span">{`Have "`}</Text>
                <DataBlockWithCopy text={requirement.data.id} />
                <Text as="span">{`" in your Twitter bio`}</Text>
              </>
            )
          case "TWITTER_FOLLOWER_COUNT":
            return `Have at least ${Math.floor(
              requirement.data.minAmount
            )} followers on Twitter`
          case "TWITTER_FOLLOW":
            return (
              <>
                {`Follow `}
                <TwitterUserLink requirement={requirement} />
                {` on Twitter`}
              </>
            )
          case "TWITTER_FOLLOWED_BY":
            return (
              <>
                {`Be followed by `}
                <TwitterUserLink requirement={requirement} />
                {` on Twitter`}
              </>
            )
          case "TWITTER_LIKE":
            return (
              <>
                {`Like `}
                <TwitterTweetLink requirement={requirement} />
              </>
            )
          case "TWITTER_RETWEET":
            return (
              <>
                {`Retweet `}
                <TwitterTweetLink requirement={requirement} />
              </>
            )
          case "TWITTER_LIST_MEMBER":
            return (
              <>
                {`Be a member of `}
                <TwitterListLink requirement={requirement} />
              </>
            )
          case "TWITTER_LIST_FOLLOW":
            return (
              <>
                {`Follow `}
                <TwitterListLink requirement={requirement} />
              </>
            )
          case "TWITTER_ACCOUNT_AGE_RELATIVE":
            const formattedAccountAge = formatRelativeTimeFromNow(
              requirement.data.minAmount
            )
            return (
              <>
                <Text as="span">{`Have a Twitter account older than `}</Text>
                <DataBlock>{formattedAccountAge}</DataBlock>
              </>
            )
          case "TWITTER_ACCOUNT_AGE":
            return (
              <>
                <Text as="span">{`Have a Twitter account since at least `}</Text>
                <DataBlockWithDate timestamp={requirement.data.minAmount} />
              </>
            )
        }
      })()}
    </Requirement>
  )
}
export default TwitterRequirement
