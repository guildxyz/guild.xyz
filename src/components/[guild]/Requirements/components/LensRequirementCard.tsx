import DataBlock from "components/common/DataBlock"
import Link from "components/common/Link"
import { Requirement } from "types"
import { RequirementLinkButton } from "./common/RequirementButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const LensRequirementCard = ({ requirement, ...rest }: Props) => {
  requirement.chain = "POLYGON"

  return (
    <RequirementCard
      requirement={requirement}
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
          default:
            return "Have a Lens Protocol profile"
        }
      })()}
    </RequirementCard>
  )
}

export default LensRequirementCard
