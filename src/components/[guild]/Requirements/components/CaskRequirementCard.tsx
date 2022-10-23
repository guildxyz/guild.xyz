import { Img } from "@chakra-ui/react"
import { Requirement } from "types"
import shortenHex from "utils/shortenHex"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const CaskRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Img src="/requirementLogos/cask.jpg" />}
  >
    {`Have`}
    {requirement.data.name ? ` a ${requirement.data.name} NFT` : ` any Cask NFT`}

    {requirement.data.traitType?.map((e) => {
      if (e.trait_type == "planId") return ` and ${e.value} plan`
      if (e.trait_type == "provider") return ` from ${shortenHex(e.value)}`
    })}
  </RequirementCard>
)

export default CaskRequirementCard
