import { Icon, Link } from "@chakra-ui/react"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import DataBlockWithCopy from "components/[guild]/Requirements/components/DataBlockWithCopy"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { TwitterLogo } from "phosphor-react"

const TwitterRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={
        requirement.type === "TWITTER_FOLLOW" && requirement.data.id ? (
          `/api/twitter-avatar?username=${requirement.data.id}`
        ) : (
          <Icon as={TwitterLogo} boxSize={6} />
        )
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
                <Link
                  href={`https://twitter.com/${requirement.data.id}`}
                  isExternal
                  colorScheme="blue"
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
}
export default TwitterRequirement
