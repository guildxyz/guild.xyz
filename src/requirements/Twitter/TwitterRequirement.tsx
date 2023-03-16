import { Icon } from "@chakra-ui/react"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import DataBlockWithCopy from "components/[guild]/Requirements/components/DataBlockWithCopy"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { TwitterLogo } from "phosphor-react"
import useSWRImmutable from "swr/immutable"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import TwitterListLink from "./components/TwitterListLink"
import TwitterTweetLink from "./components/TwitterTweetLink"
import TwitterUserLink from "./components/TwitterUserLink"

const TwitterRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { data: twitterAvatar } = useSWRImmutable(
    requirement.data.id ? `/assets/twitter/avatar/${requirement.data.id}` : null
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
                {`Have "`}
                <DataBlockWithCopy text={requirement.data.id} />
                {`" in your Twitter username`}
              </>
            )
          case "TWITTER_BIO":
            return (
              <>
                {`Have "`}
                <DataBlockWithCopy text={requirement.data.id} />
                {`" in your Twitter bio`}
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
                {`Have a Twitter account older than `}
                <DataBlock>{formattedAccountAge}</DataBlock>
              </>
            )
          case "TWITTER_ACCOUNT_AGE":
            const formattedDate = new Date(
              requirement.data.minAmount
            ).toLocaleDateString()

            return (
              <>
                {`Have a Twitter account since at least `}
                <DataBlock>{formattedDate}</DataBlock>
              </>
            )
        }
      })()}
    </Requirement>
  )
}
export default TwitterRequirement
