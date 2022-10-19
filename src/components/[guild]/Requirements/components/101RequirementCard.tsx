import { Img } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const HundredNOneRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Img src="/requirementLogos/101.png" />}
    // footer={
    //   <RequirementLinkButton
    //     imageUrl={"/requirementLogos/101.png"}
    //     href={`https://101.xyz/course/${requirement.data.id}`}
    //   >
    //     View badge
    //   </RequirementLinkButton>
    // }
  >
    {`Have the badge of 101 course `}
    <DataBlock>{`#${requirement.data.id}`}</DataBlock>
  </RequirementCard>
)

export default HundredNOneRequirementCard
