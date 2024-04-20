import { Link } from "@chakra-ui/next-js"
import { Skeleton } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import REQUIREMENTS from "requirements"
import { LensActionType, lensPlatformOptions } from "./components/LensAction"
import { LensReaction } from "./components/LensReact"
import useLensProfile from "./hooks/useLensProfile"

const getReactionLabel = (lensReaction: LensReaction) => {
  switch (lensReaction) {
    case "UPVOTE":
      return "Upvote"
    case "DOWNVOTE":
      return "Downvote"
    default:
      return "React on"
  }
}

const getActionLabel = (lensAction: LensActionType) => {
  switch (lensAction) {
    case "COMMENT":
      return "Comment on"
    case "QUOTE":
      return "Quote"
    default:
      return "Mirror"
  }
}

const getActionPlatform = (publishedOn?: string) =>
  lensPlatformOptions.find((o) => o.value === publishedOn)?.label ?? "Lens protocol"

const getPlatformBaseUrl = (publishedOn?: string) => {
  switch (publishedOn) {
    case "orb":
      return "https://orb.club/p/"
    default:
      return "https://hey.xyz/posts/"
  }
}

const LensRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()
  requirement.chain = "POLYGON"

  if (requirement.type === "LENS_FOLLOW" || requirement.type === "LENS_FOLLOWED_BY")
    return <LensFollowRequirement {...props} />

  return (
    <Requirement image={REQUIREMENTS.LENS.icon as string} {...props}>
      {(() => {
        switch (requirement.type) {
          case "LENS_REACT":
            return (
              <>
                {`${getReactionLabel(requirement.data.reaction)} the `}
                <LensPostLink />
                {` post on Lens Protocol`}
              </>
            )
          case "LENS_ACTION":
            return (
              <>
                {`${getActionLabel(requirement.data.action)} the `}
                <LensPostLink />
                {` post on ${getActionPlatform(requirement.data.publishedOn)}`}
              </>
            )
          case "LENS_COLLECT":
            return (
              <>
                {`Collect the `}
                <LensPostLink />
                {` post on Lens Protocol`}
              </>
            )
          case "LENS_TOTAL_FOLLOWERS":
            return (
              <>{`Have at least ${requirement.data.min} followers on Lens Protocol`}</>
            )
          case "LENS_TOTAL_POSTS":
            return (
              <>{`Have at least ${requirement.data.min} posts on Lens Protocol`}</>
            )
          default:
            return "Have a Lens Protocol profile"
        }
      })()}
    </Requirement>
  )
}

const LensFollowRequirement = (props: RequirementProps) => {
  const { type, data } = useRequirementContext()
  const { data: lensProfile, isLoading } = useLensProfile(data.id)

  return (
    <Requirement
      image={lensProfile?.img ?? (REQUIREMENTS.LENS.icon as string)}
      isImageLoading={isLoading}
      {...props}
    >
      {type === "LENS_FOLLOW" ? "Follow " : "Be followed by "}
      <Skeleton isLoaded={!isLoading} display="inline">
        <Link
          href={`https://lensfrens.xyz/${lensProfile?.label?.replace(".lens", "")}`}
          isExternal
          colorScheme="blue"
          fontWeight="medium"
        >
          {lensProfile?.label ?? "Loading..."}
        </Link>
      </Skeleton>
      {" on Lens protocol"}
    </Requirement>
  )
}

const LensPostLink = () => {
  const { data } = useRequirementContext()

  return (
    <Link
      href={`${getPlatformBaseUrl(data.publishedOn)}${data.id}`}
      isExternal
      display="inline"
      colorScheme="blue"
      fontWeight="medium"
    >
      {data.id}
    </Link>
  )
}

export default LensRequirement
