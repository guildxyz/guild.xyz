import { Requirement } from "types"
import shortenHex from "utils/shortenHex"
import BlockExplorerUrl from "./common/BlockExplorerUrl"
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
          <BlockExplorerUrl requirement={requirement} />
        )
      }
    >
      {(() => {
        switch (requirement.type) {
          case "LENS_COLLECT":
            return (
              <>
                {`Collect the `}
                <pre>{shortenHex(requirement.address)}</pre>
                {` post on Lens Protocol`}
              </>
            )
          case "LENS_MIRROR":
            return (
              <>
                {`Mirror the `}
                <pre>{shortenHex(requirement.address)}</pre>
                {` post on Lens Protocol`}
              </>
            )
          case "LENS_FOLLOW":
            return (
              <>
                {`Follow `}
                <pre>{requirement.data.id}</pre>
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
