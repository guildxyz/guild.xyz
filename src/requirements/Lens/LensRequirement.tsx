import { Anchor } from "@/components/ui/Anchor"
import { Skeleton } from "@/components/ui/Skeleton"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import REQUIREMENTS from "requirements"
import { lensPlatformOptions } from "./constants"
import useLensProfile from "./hooks/useLensProfile"
import { LensActionType, LensReaction } from "./types"

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
    <Requirement image={REQUIREMENTS.LENS_ACTION.icon as string} {...props}>
      {(() => {
        switch (requirement.type) {
          case "LENS_REACT":
            return (
              <>
                <span>{`${getReactionLabel(requirement.data.reaction)} the `}</span>
                <LensPostLink />
                <span>{" post on Lens Protocol"}</span>
              </>
            )
          case "LENS_ACTION":
            return (
              <>
                <span>{`${getActionLabel(requirement.data.action)} the `}</span>
                <LensPostLink />
                <span>{` post on ${getActionPlatform(requirement.data.publishedOn)}`}</span>
              </>
            )
          case "LENS_COLLECT":
            return (
              <>
                <span>{"Collect the "}</span>
                <LensPostLink />
                <span>{" post on Lens Protocol"}</span>
              </>
            )
          case "LENS_TOTAL_FOLLOWERS":
            return `Have at least ${requirement.data.min} followers on Lens Protocol`
          case "LENS_TOTAL_POSTS":
            return `Have at least ${requirement.data.min} posts on Lens Protocol`
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
      image={lensProfile?.img ?? (REQUIREMENTS.LENS_FOLLOW.icon as string)}
      isImageLoading={isLoading}
      {...props}
    >
      {type === "LENS_FOLLOW" ? "Follow " : "Be followed by "}
      {isLoading ? (
        <Skeleton className="inline-block h-5 w-40" />
      ) : (
        <Anchor
          href={`https://lensfrens.xyz/${lensProfile?.label?.replace(".lens", "")}`}
          variant="highlighted"
          showExternal
          target="_blank"
        >
          {lensProfile?.label ?? "Loading..."}
        </Anchor>
      )}
      <span>{" on Lens protocol"}</span>
    </Requirement>
  )
}

const LensPostLink = () => {
  const { data } = useRequirementContext()

  return (
    <Anchor
      href={`${getPlatformBaseUrl(data.publishedOn)}${data.id}`}
      variant="highlighted"
      showExternal
      target="_blank"
    >
      {data.id}
    </Anchor>
  )
}

export default LensRequirement
