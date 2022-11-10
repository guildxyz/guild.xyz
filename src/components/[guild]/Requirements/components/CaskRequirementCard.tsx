import { Img } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { RequirementCardComponentProps } from "types"
import shortenHex from "utils/shortenHex"
import RequirementCard from "./common/RequirementCard"

const CaskRequirementCard = ({
  requirement,
  ...rest
}: RequirementCardComponentProps) => (
  <RequirementCard image={<Img src="/requirementLogos/cask.png" />} {...rest}>
    {`Subscribe to plan `}
    <DataBlock>{`#${requirement.data.planId}`}</DataBlock>
    {` by `}
    <DataBlock>{shortenHex(requirement.data.provider)}</DataBlock>
    {` on Cask Protocol`}
  </RequirementCard>
)

export default CaskRequirementCard
