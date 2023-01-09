import DataBlock from "components/common/DataBlock"
import Link from "components/common/Link"
import { RequirementComponentProps } from "requirements"
import Requirement from "../common/Requirement"
import { RequirementLinkButton } from "../common/RequirementButton"

const LensRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  requirement.chain = "POLYGON"

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={"requirementLogos/lens.png"}
      footer={
        ["LENS_COLLECT", "LENS_MIRROR"].includes(requirement.type) && (
          <RequirementLinkButton
            imageUrl="https://lenster.xyz/logo.svg"
            href={`https://lenster.xyz/posts/${requirement.data.id}`}
          >
            View on Lenster
          </RequirementLinkButton>
        )
      }
      {...rest}
    >
      {(() => {
        switch (requirement.type) {
          case "LENS_COLLECT":
            return (
              <>
                {`Collect the `}
                <DataBlock>{requirement.data.id}</DataBlock>
                {` post on Lens Protocol`}
              </>
            )
          case "LENS_MIRROR":
            return (
              <>
                {`Mirror the `}
                <DataBlock>{requirement.data.id}</DataBlock>
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
                  color="#BEFB5A"
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
                  color="#BEFB5A"
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
