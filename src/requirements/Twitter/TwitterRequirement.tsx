import { XLogo } from "@phosphor-icons/react/dist/ssr"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import { DataBlockWithDate } from "components/[guild]/Requirements/components/DataBlockWithDate"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useUser from "components/[guild]/hooks/useUser"
import { DataBlock } from "components/common/DataBlock"
import { DataBlockWithCopy } from "components/common/DataBlockWithCopy"
import { RequirementType } from "requirements/types"
import { PlatformType } from "types"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import pluralize from "../../utils/pluralize"
import TwitterIntent, { TwitterIntentAction } from "./components/TwitterIntent"
import TwitterListLink from "./components/TwitterListLink"
import TwitterTweetLink from "./components/TwitterTweetLink"
import TwitterUserLink from "./components/TwitterUserLink"

type TwitterRequirementType =
  | Extract<RequirementType, `TWITTER_${string}`>
  /**
   * Looks odd, but "LINK_VISIT" & the V2 Twitter requirements use the same schema, so we need to add this here in order to get proper types
   */
  | "LINK_VISIT"

const requirementIntentAction: Partial<
  Record<TwitterRequirementType, TwitterIntentAction>
> = {
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

  return (
    <Requirement
      image={<XLogo weight="bold" className="size-6" />}
      footer={
        requirement.type in requirementIntentAction && !!userId ? (
          !isTwitterConnected ? (
            <ConnectRequirementPlatformButton />
          ) : (
            <TwitterIntent
              action={
                requirementIntentAction[
                  requirement.type as TwitterRequirementType
                ] as TwitterIntentAction
              }
            />
          )
        ) : (
          <ConnectRequirementPlatformButton />
        )
      }
      {...props}
    >
      {(() => {
        const minAmount = Math.floor(
          "minAmount" in requirement.data ? requirement.data.minAmount : 0
        )

        switch (requirement.type as TwitterRequirementType) {
          case "TWITTER_NAME":
            return (
              <>
                <span>{'Have "'}</span>
                <DataBlockWithCopy text={requirement.data.id} />
                <span>{'" in your X username'}</span>
              </>
            )
          case "TWITTER_BIO":
            return (
              <>
                <span>{'Have "'}</span>
                <DataBlockWithCopy text={requirement.data.id} />
                <span>{'" in your X bio'}</span>
              </>
            )
          case "TWITTER_FOLLOWER_COUNT":
            return `Have at least ${pluralize(minAmount, "follower")} on X`
          case "TWITTER_FOLLOWING_COUNT":
            return `Follow at least ${pluralize(minAmount, "account")} on X`
          case "TWITTER_TWEET_COUNT":
            return `Have at least ${pluralize(minAmount, "post")} on X`
          case "TWITTER_LIKE_COUNT":
            return `Have given at least ${pluralize(minAmount, "like")} on X`
          case "TWITTER_ACCOUNT_PROTECTED":
            return "Have a protected X account"
          case "TWITTER_ACCOUNT_VERIFIED":
            return `Have a verified ${
              requirement.data?.id !== "any" ? requirement.data.id : ""
            } X account`
          case "TWITTER_FOLLOW":
            return (
              <>
                <span>{"Follow "}</span>
                <TwitterUserLink requirement={requirement} withIntent />
                <span>{" on X"}</span>
              </>
            )
          case "TWITTER_FOLLOW_V2":
            return (
              <>
                <span>{"Follow "}</span>
                <TwitterIntent type="link" action="follow">
                  @{requirement.data.id}
                </TwitterIntent>
                <span>{" on X"}</span>
              </>
            )
          case "TWITTER_FOLLOWED_BY":
            return (
              <>
                <span>{"Be followed by "}</span>
                <TwitterUserLink requirement={requirement} />
                <span>{" on X"}</span>
              </>
            )
          case "TWITTER_LIKE":
            return (
              <>
                <span>{"Like "}</span>
                <TwitterTweetLink requirement={requirement} />
              </>
            )
          case "TWITTER_LIKE_V2":
            return (
              <>
                <span>{"Like "}</span>
                <TwitterIntent type="link" action="like">
                  this post
                </TwitterIntent>
              </>
            )
          case "TWITTER_RETWEET":
            return (
              <>
                <span>{"Repost "}</span>
                <TwitterTweetLink requirement={requirement} />
                <span>{" on X"}</span>
              </>
            )
          case "TWITTER_RETWEET_V2":
            return (
              <>
                <span>{"Repost "}</span>
                <TwitterIntent type="link" action="retweet">
                  this post
                </TwitterIntent>
              </>
            )
          case "TWITTER_LIST_MEMBER":
            return (
              <>
                <span>{"Be a member of "}</span>
                <TwitterListLink requirement={requirement} />
              </>
            )
          case "TWITTER_ACCOUNT_AGE_RELATIVE":
            const formattedAccountAge = formatRelativeTimeFromNow(
              requirement.data.minAmount
            )
            return (
              <>
                <span>{"Have an X account older than "}</span>
                <DataBlock>{formattedAccountAge}</DataBlock>
              </>
            )
          case "TWITTER_ACCOUNT_AGE":
            return (
              <>
                <span>{"Have an X account since at least "}</span>
                <DataBlockWithDate timestamp={requirement.data.minAmount} />
              </>
            )
        }
      })()}
    </Requirement>
  )
}

export default TwitterRequirement
