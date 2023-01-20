import { Img } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { rabbitholeCourses } from "./RabbitholeForm"

const RabbitholeRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={<Img src="/requirementLogos/rabbithole.png" />}
      {...props}
    >
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
}

export default RabbitholeRequirement
