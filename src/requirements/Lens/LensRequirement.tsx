import { Link } from "@chakra-ui/next-js"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import REQUIREMENTS from "requirements"
import useLensProfile from "./hooks/useLensProfile"

const LensRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()
  requirement.chain = "POLYGON"

  if (requirement.type === "LENS_FOLLOW" || requirement.type === "LENS_FOLLOWED_BY")
    return <LensFollowRequirement {...props} />

  return (
    <Requirement image={REQUIREMENTS.LENS.icon as string} {...props}>
      {(() => {
        switch (requirement.type) {
          case "LENS_COLLECT":
            return (
              <>
                {`Collect the `}
                <Link
                  href={`https://hey.xyz/posts/${requirement.data.id}`}
                  isExternal
                  display="inline"
                  colorScheme="blue"
                  fontWeight="medium"
                >
                  {requirement.data.id}
                </Link>
                {` post on Lens Protocol`}
              </>
            )
          case "LENS_MIRROR":
            return (
              <>
                {`Mirror the `}
                <Link
                  href={`https://hey.xyz/posts/${requirement.data.id}`}
                  isExternal
                  display="inline"
                  colorScheme="blue"
                  fontWeight="medium"
                >
                  {requirement.data.id}
                </Link>
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
      <Link
        href={`https://lensfrens.xyz/${data.id.replace(".lens", "")}`}
        isExternal
        colorScheme="blue"
        fontWeight="medium"
      >
        {data.id}
      </Link>
      {" on Lens protocol"}
    </Requirement>
  )
}

export default LensRequirement
