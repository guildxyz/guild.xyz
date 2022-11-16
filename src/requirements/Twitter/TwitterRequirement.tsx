import { Icon, Link } from "@chakra-ui/react"
import DataBlockWithCopy from "components/common/DataBlockWithCopy"
import { TwitterLogo } from "phosphor-react"
import { RequirementComponentProps } from "requirements"
import ConnectRequirementPlatformButton from "../common/ConnectRequirementPlatformButton"
import Requirement from "../common/Requirement"

const TwitterRequirement = ({ requirement, ...rest }: RequirementComponentProps) => (
  <Requirement
    image={
      requirement.type === "TWITTER_FOLLOW" && requirement.data.id ? (
        typeof window !== "undefined" ? (
          `${window.origin}/api/twitter-avatar?username=${requirement.data.id}`
        ) : (
          "/default_twitter_icon.png"
        )
      ) : (
        <Icon as={TwitterLogo} boxSize={6} />
      )
    }
    footer={<ConnectRequirementPlatformButton platform="TWITTER" />}
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
              <Link
                href={`https://twitter.com/${requirement.data.id}`}
                isExternal
                colorScheme={"blue"}
                fontWeight="medium"
              >
                @{requirement.data.id}
              </Link>
              {` on Twitter`}
            </>
          )
      }
    })()}
  </Requirement>
)

export default TwitterRequirement
