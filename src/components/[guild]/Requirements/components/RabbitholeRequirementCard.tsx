import { Img } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { rabbitholeCourses } from "components/create-guild/Requirements/components/RabbitholeFormCard"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const RabbitholeRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Img src="/requirementLogos/rabbithole.png" />}
  >
    {`Have an NFT from the `}
    <DataBlock>
      {
        rabbitholeCourses.find((course) => course.value === requirement.address)
          .label
      }
    </DataBlock>
    {` Rabbithole skill`}
  </RequirementCard>
)

export default RabbitholeRequirementCard
