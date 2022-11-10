import { Img } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import use101Courses from "components/create-guild/Requirements/components/101FormCard/hooks/use101Courses"
import { RequirementCardComponentProps } from "types"
import { RequirementLinkButton } from "./common/RequirementButton"
import RequirementCard from "./common/RequirementCard"

const HundredNOneRequirementCard = ({
  requirement,
  ...rest
}: RequirementCardComponentProps) => {
  const { data, isValidating } = use101Courses()

  const badge = data?.find(
    (option) => option.onChainId.toString() === requirement.data.id
  )

  return (
    <RequirementCard
      image={
        <Img
          src={
            badge?.imageUri?.replace("ipfs://", "https://ipfs.fleek.co/ipfs/") ??
            "/requirementLogos/101.png"
          }
        />
      }
      footer={
        <RequirementLinkButton
          imageUrl={"/requirementLogos/101.png"}
          href={`https://101.xyz/course/${badge?.courses?.[0]?.id}`}
        >
          View course
        </RequirementLinkButton>
      }
      {...rest}
    >
      {`Have the badge of the `}
      <DataBlock isLoading={!badge && isValidating}>
        {badge?.courses?.[0]?.title ?? requirement.data.id}
      </DataBlock>
      {` 101 course `}
    </RequirementCard>
  )
}

export default HundredNOneRequirementCard
