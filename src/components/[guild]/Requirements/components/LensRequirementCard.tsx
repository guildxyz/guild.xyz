import { Requirement } from "types"
import shortenHex from "utils/shortenHex"
import BlockExplorerUrl from "./common/BlockExplorerUrl"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const LensRequirementCard = ({ requirement }: Props) => {
  requirement.chain = "POLYGON"
  // trim address because the BE saves 42 spaces if we send ""
  if (!requirement.address?.trim()?.length) requirement.address = ""

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
