import { Img } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { RequirementComponentProps } from "requirements"
import Requirement from "../common/Requirement"
import { RequirementLinkButton } from "../common/RequirementButton"
import use101Courses from "./hooks/use101Courses"

const HundredNOneRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps) => {
  const { data, isValidating } = use101Courses()

  const badge = data?.find(
    (option) => option.onChainId.toString() === requirement.data.id
  )

  return (
    <Requirement
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
        {badge?.courses?.[0]?.title.trim() ?? `#${requirement.data.id}`}
      </DataBlock>
      {` 101 course `}
    </Requirement>
  )
}

export default HundredNOneRequirement
