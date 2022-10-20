import { Img } from "@chakra-ui/react"
import { DefaultParamType, Requirement } from "types"
import shortenHex from "utils/shortenHex"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const CaskRequirementCard = ({ requirement }: Props) => {
  const param = requirement.data.params as DefaultParamType
  return (
    <RequirementCard
      requirement={requirement}
      image={<Img src="/requirementLogos/cask.jpg" />}
    >
      {`Have`}
      {requirement.data.id ? ` a ${requirement.data.id} NFT` : ` any Cask NFT`}

      {param.map((e) => {
        if (e.trait_type == "planId") return ` and ${e.value} plan`
        if (e.trait_type == "provider") return ` from ${shortenHex(e.value)}`
      })}
    </RequirementCard>
  )
}

export default CaskRequirementCard
