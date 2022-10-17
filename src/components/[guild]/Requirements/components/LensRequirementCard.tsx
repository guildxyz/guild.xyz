import Pre from "components/common/Pre"
import { Requirement } from "types"
import { RequirementLinkButton } from "./common/RequirementButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const LensRequirementCard = ({ requirement }: Props) => {
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
    >
      {(() => {
        switch (requirement.type) {
          case "LENS_COLLECT":
            return (
              <>
                {`Collect the `}
                <Pre>{requirement.data.id}</Pre>
                {` post on Lens Protocol`}
              </>
            )
          case "LENS_MIRROR":
            return (
              <>
                {`Mirror the `}
                <Pre>{requirement.data.id}</Pre>
                {` post on Lens Protocol`}
              </>
            )
          case "LENS_FOLLOW":
            return (
              <>
                {`Follow `}
                <Pre>{requirement.data.id}</Pre>
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
