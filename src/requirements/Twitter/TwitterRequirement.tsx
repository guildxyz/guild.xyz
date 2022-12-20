import { Icon } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import DataBlockWithCopy from "components/common/DataBlockWithCopy"
import { TwitterLogo } from "phosphor-react"
import { RequirementComponentProps } from "requirements"
import ConnectRequirementPlatformButton from "../common/ConnectRequirementPlatformButton"
import Requirement from "../common/Requirement"
import TwitterListLink from "./components/TwitterListLink"
import TwitterTweetLink from "./components/TwitterTweetLink"
import TwitterUserLink from "./components/TwitterUserLink"

const TwitterRequirement = ({ requirement, ...rest }: RequirementComponentProps) => (
  <Requirement
    image={
      ["TWITTER_FOLLOW", "TWITTER_FOLLOWED_BY"].includes(requirement.type) &&
      requirement.data.id ? (
        `/api/twitter-avatar?username=${requirement.data.id}`
      ) : (
        <Icon as={TwitterLogo} boxSize={6} />
      )
    }
    footer={<ConnectRequirementPlatformButton requirement={requirement} />}
    {...rest}
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
        case "TWITTER_ACCOUNT_AGE":
          const formattedDate = new Date(
            requirement.data.minAmount
          ).toLocaleDateString()

          return (
            <>
              {`Be a Twitter user since at least `}
              <DataBlock>{formattedDate}</DataBlock>
            </>
          )
      }
    })()}
  </Requirement>
)

export default TwitterRequirement
