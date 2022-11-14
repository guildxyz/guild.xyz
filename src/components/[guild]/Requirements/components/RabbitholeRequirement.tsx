import { Img } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { rabbitholeCourses } from "components/create-guild/Requirements/components/RabbitholeFormCard"
import { RequirementComponentProps } from "types"
import Requirement from "./common/Requirement"

const RabbitholeRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps) => (
  <Requirement image={<Img src="/requirementLogos/rabbithole.png" />} {...rest}>
    {`Have an NFT from the `}
    <DataBlock>
      {
        rabbitholeCourses.find((course) => course.value === requirement.address)
          .label
      }
    </DataBlock>
    {` Rabbithole skill`}
  </Requirement>
)

export default RabbitholeRequirement
