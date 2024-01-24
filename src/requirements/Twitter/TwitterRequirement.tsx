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
import { ArrowSquareOut, TwitterLogo } from "phosphor-react"
import useSWRImmutable from "swr/immutable"
import { PlatformType } from "types"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import TwitterIntent, { TwitterIntentAction } from "./components/TwitterIntent"
import TwitterListLink from "./components/TwitterListLink"
import TwitterTweetLink from "./components/TwitterTweetLink"
import TwitterUserLink from "./components/TwitterUserLink"

const pluralize = (count: number, noun: string) => `${noun}${count !== 1 ? "s" : ""}`

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
    (pu) => pu.platformId === PlatformType.TWITTER
  )

  const { data: twitterAvatar } = useSWRImmutable(
    requirement.data?.id && TWITTER_HANDLE_REGEX.test(requirement.data.id)
      ? `/v2/third-party/twitter/users/${requirement.data.id}/avatar`
      : null
  )

  return (
    <Requirement
      image={
        (["TWITTER_FOLLOW", "TWITTER_FOLLOWED_BY"].includes(requirement.type) &&
          twitterAvatar) || <Icon as={TwitterLogo} boxSize={6} />
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
        const minCount = Math.floor(requirement.data.minAmount)

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
            return (
              `Have at least ${minCount} ` +
              pluralize(minCount, "follower") +
              " on Twitter"
            )
          case "TWITTER_TWEET_COUNT":
            return (
              <>
                <Text as="span">{"Have at least "}</Text>
                <DataBlock>{minCount}</DataBlock>
                <Text as="span">{pluralize(minCount, " Tweet")}</Text>
              </>
            )
          case "TWITTER_LIKE_COUNT":
            return (
              <>
                <Text as="span">{"Have at least "}</Text>
                <DataBlock>{minCount}</DataBlock>
                <Text as="span">
                  {` given ${pluralize(minCount, "like")} on Twitter`}
                </Text>
              </>
            )
          case "TWITTER_ACCOUNT_PROTECTED":
            return <Text as="span">{`Have protected Twitter account`}</Text>
          case "TWITTER_ACCOUNT_VERIFIED":
            return requirement.data?.id ? (
              <Text as="span">
                {"Have "}
                <DataBlockWithCopy text={requirement.data.id} />
                {" Twitter account verification"}
              </Text>
            ) : (
              <Text as="span">{"Have verified Twitter account"}</Text>
            )
          case "TWITTER_FOLLOW":
            return (
              <>
                {`Follow `}
                <TwitterUserLink requirement={requirement} />
                {` on Twitter`}
              </>
            )
          case "TWITTER_FOLLOW_V2":
            return (
              <>
                {`Follow `}
                <TwitterIntent type="link" action="follow">
                  @{requirement.data.id}
                </TwitterIntent>
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
          case "TWITTER_LIKE_V2":
            return (
              <>
                {`Like `}
                <TwitterIntent type="link" action="like">
                  this tweet
                  <Icon as={ArrowSquareOut} mx="1" />
                </TwitterIntent>
              </>
            )
          case "TWITTER_RETWEET":
            return (
              <>
                {`Retweet `}
                <TwitterTweetLink requirement={requirement} />
              </>
            )
          case "TWITTER_RETWEET_V2":
            return (
              <>
                {`Retweet `}
                <TwitterIntent type="link" action="retweet">
                  this tweet
                  <Icon as={ArrowSquareOut} mx="1" />
                </TwitterIntent>
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
