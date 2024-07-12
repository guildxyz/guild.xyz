import { Icon, Text } from "@chakra-ui/react"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import DataBlockWithDate from "components/[guild]/Requirements/components/DataBlockWithDate"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useUser from "components/[guild]/hooks/useUser"
import DataBlock from "components/common/DataBlock"
import DataBlockWithCopy from "components/common/DataBlockWithCopy"
import { ArrowSquareOut } from "phosphor-react"
import XLogo from "static/icons/x.svg"
import useSWRImmutable from "swr/immutable"
import { PlatformType } from "types"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import pluralize from "../../utils/pluralize"
import TwitterIntent, { TwitterIntentAction } from "./components/TwitterIntent"
import TwitterListLink from "./components/TwitterListLink"
import TwitterTweetLink from "./components/TwitterTweetLink"
import TwitterUserLink from "./components/TwitterUserLink"

const requirementIntentAction: Record<string, TwitterIntentAction> = {
  TWITTER_FOLLOW_V2: "follow",
  TWITTER_LIKE_V2: "like",
  TWITTER_RETWEET_V2: "retweet",
}

// https://help.twitter.com/en/managing-your-account/twitter-username-rules
export const TWITTER_HANDLE_REGEX = /^[a-z0-9_]+$/i

const TwitterRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()
  const { id: userId, platformUsers } = useUser()
  const isTwitterConnected = platformUsers?.find(
    (pu) => pu.platformId === PlatformType.TWITTER_V1
  )

  const { data: twitterAvatar } = useSWRImmutable(
    // requirement.data?.id && TWITTER_HANDLE_REGEX.test(requirement.data.id)
    false ? `/v2/third-party/twitter/users/${requirement.data.id}/avatar` : null
  )

  return (
    <Requirement
      image={
        (["TWITTER_FOLLOW", "TWITTER_FOLLOWED_BY"].includes(requirement.type) &&
          twitterAvatar) || <Icon as={XLogo} boxSize={6} />
      }
      footer={
        requirementIntentAction[requirement.type] && !!userId ? (
          !isTwitterConnected ? (
            <ConnectRequirementPlatformButton />
          ) : (
            <TwitterIntent action={requirementIntentAction[requirement.type]} />
          )
        ) : (
          <ConnectRequirementPlatformButton />
        )
      }
      {...props}
    >
      {(() => {
        const minAmount = Math.floor(requirement.data?.minAmount)

        switch (requirement.type) {
          case "TWITTER_NAME":
            return (
              <>
                <Text as="span">{'Have "'}</Text>
                <DataBlockWithCopy text={requirement.data.id} />
                <Text as="span">{'" in your X username'}</Text>
              </>
            )
          case "TWITTER_BIO":
            return (
              <>
                <Text as="span">{'Have "'}</Text>
                <DataBlockWithCopy text={requirement.data.id} />
                <Text as="span">{'" in your X bio'}</Text>
              </>
            )
          case "TWITTER_FOLLOWER_COUNT":
            return (
              <Text as="span">
                {`Have at least ${pluralize(minAmount, "follower")} on X`}
              </Text>
            )
          case "TWITTER_FOLLOWING_COUNT":
            return (
              <Text as="span">
                {`Follow at least ${pluralize(minAmount, "account")} on X`}
              </Text>
            )

          case "TWITTER_TWEET_COUNT":
            return (
              <Text as="span">
                {`Have at least ${pluralize(minAmount, "post")} on X`}
              </Text>
            )
          case "TWITTER_LIKE_COUNT":
            return (
              <Text as="span">
                {`Have given at least ${pluralize(minAmount, "like")} on X`}
              </Text>
            )
          case "TWITTER_ACCOUNT_PROTECTED":
            return <Text as="span">Have a protected X account</Text>
          case "TWITTER_ACCOUNT_VERIFIED":
            return (
              <Text as="span">
                {`Have a verified ${
                  requirement.data?.id !== "any" ? requirement.data.id : ""
                } X account`}
              </Text>
            )
          case "TWITTER_FOLLOW":
            return (
              <>
                {"Follow "}
                <TwitterUserLink requirement={requirement} withIntent />
                {" on X"}
              </>
            )
          case "TWITTER_FOLLOW_V2":
            return (
              <>
                {"Follow "}
                <TwitterIntent type="link" action="follow">
                  @{requirement.data.id}
                </TwitterIntent>
                {" on X"}
              </>
            )
          case "TWITTER_FOLLOWED_BY":
            return (
              <>
                {"Be followed by "}
                <TwitterUserLink requirement={requirement} />
                {" on X"}
              </>
            )
          case "TWITTER_LIKE":
            return (
              <>
                {"Like "}
                <TwitterTweetLink requirement={requirement} />
              </>
            )
          case "TWITTER_LIKE_V2":
            return (
              <>
                {"Like "}
                <TwitterIntent type="link" action="like">
                  this post
                  <Icon as={ArrowSquareOut} mx="1" />
                </TwitterIntent>
              </>
            )
          case "TWITTER_RETWEET":
            return (
              <>
                {"Repost "}
                <TwitterTweetLink requirement={requirement} />
                {" on X"}
              </>
            )
          case "TWITTER_RETWEET_V2":
            return (
              <>
                {"Repost "}
                <TwitterIntent type="link" action="retweet">
                  this post
                  <Icon as={ArrowSquareOut} mx="1" />
                </TwitterIntent>
              </>
            )
          case "TWITTER_LIST_MEMBER":
            return (
              <>
                {"Be a member of "}
                <TwitterListLink requirement={requirement} />
              </>
            )
          case "TWITTER_ACCOUNT_AGE_RELATIVE":
            const formattedAccountAge = formatRelativeTimeFromNow(
              requirement.data.minAmount
            )
            return (
              <>
                <Text as="span">{"Have an X account older than "}</Text>
                <DataBlock>{formattedAccountAge}</DataBlock>
              </>
            )
          case "TWITTER_ACCOUNT_AGE":
            return (
              <>
                <Text as="span">{"Have an X account since at least "}</Text>
                <DataBlockWithDate timestamp={requirement.data.minAmount} />
              </>
            )
        }
      })()}
    </Requirement>
  )
}
export default TwitterRequirement
