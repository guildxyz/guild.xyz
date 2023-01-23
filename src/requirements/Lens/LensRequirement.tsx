import Link from "components/common/Link"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"

const LensRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()
  requirement.chain = "POLYGON"

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={"requirementLogos/lens.png"}
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "LENS_COLLECT":
            return (
              <>
                {`Collect the `}
                <Link
                  href={`https://lenster.xyz/posts/${requirement.data.id}`}
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
                  href={`https://lenster.xyz/posts/${requirement.data.id}`}
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
          case "LENS_FOLLOW":
            return (
              <>
                {`Follow `}
                <Link
                  href={`https://lensfrens.xyz/${requirement.data.id}`}
                  isExternal
                  colorScheme="blue"
                  fontWeight="medium"
                >
                  {requirement.data.id}
                </Link>
                {` on Lens protocol`}
              </>
            )
          case "LENS_FOLLOWED_BY":
            return (
              <>
                {`Be followed by `}
                <Link
                  href={`https://lensfrens.xyz/${requirement.data.id}`}
                  isExternal
                  colorScheme="blue"
                  fontWeight="medium"
                >
                  {requirement.data.id}
                </Link>
                {` on Lens protocol`}
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

export default LensRequirement
