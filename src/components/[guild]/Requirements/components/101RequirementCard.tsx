import { Img } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import use101Courses from "components/create-guild/Requirements/components/101FormCard/hooks/use101Courses"
import { Requirement } from "types"
import { RequirementLinkButton } from "./common/RequirementButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const HundredNOneRequirementCard = ({ requirement }: Props) => {
  const { data, isValidating } = use101Courses()

  const course = data?.find(
    (option) => option.badge.onChainId.toString() === requirement.data.id
  )

  return (
    <RequirementCard
      requirement={requirement}
      image={
        <Img
          src={
            course?.badge?.imageUri?.replace(
              "ipfs://",
              "https://ipfs.fleek.co/ipfs/"
            ) ?? "/requirementLogos/101.png"
          }
        />
      }
      footer={
        <RequirementLinkButton
          imageUrl={"/requirementLogos/101.png"}
          href={`https://101.xyz/course/${course?.id}`}
        >
          View course
        </RequirementLinkButton>
      }
    >
      {`Have the badge of the `}
      <DataBlock isLoading={!course && isValidating}>
        {course?.title ?? requirement.data.id}
      </DataBlock>
      {` 101 course `}
    </RequirementCard>
  )
}

export default HundredNOneRequirementCard
