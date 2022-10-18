import { Img } from "@chakra-ui/react"
import { RabbitholeParamType, Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const RabbitholeRequirementCard = ({ requirement }: Props) => {
  const param = requirement.data.params as RabbitholeParamType
  return (
    <RequirementCard
      requirement={requirement}
      image={<Img src="/requirementLogos/rabbithole.jpg" />}
    >
      {`Hold an ${requirement.data.id} NFT`}
      {param.map((e) => {
        if (e.trait_type == "Level")
          return ` and complete all the ${e.value} courses`
        if (e.trait_type == "Topic") return ` and complete the ${e.value} courses`
      })}
    </RequirementCard>
  )
}

export default RabbitholeRequirementCard
