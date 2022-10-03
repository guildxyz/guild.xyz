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
      footer={requirement.address && <BlockExplorerUrl requirement={requirement} />}
    >
      {requirement.address ? (
        <>
          {`Own the `}
          <pre>{shortenHex(requirement.address)}</pre>
          {` Lens Protocol collect/mirror NFT`}
        </>
      ) : requirement.data?.id ? (
        <>
          {`Follow `}
          <pre>{requirement.data.id}</pre>
          {` on the Lens protocol`}
        </>
      ) : (
        "Have a Lens Protocol profile"
      )}
    </RequirementCard>
  )
}

export default LensRequirementCard
