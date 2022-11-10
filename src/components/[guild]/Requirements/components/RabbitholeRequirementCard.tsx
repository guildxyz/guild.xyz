import { Img } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { rabbitholeCourses } from "components/create-guild/Requirements/components/RabbitholeFormCard"
import { RequirementCardComponentProps } from "types"
import RequirementCard from "./common/RequirementCard"

const RabbitholeRequirementCard = ({
  requirement,
  ...rest
}: RequirementCardComponentProps) => (
  <RequirementCard image={<Img src="/requirementLogos/rabbithole.png" />} {...rest}>
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
