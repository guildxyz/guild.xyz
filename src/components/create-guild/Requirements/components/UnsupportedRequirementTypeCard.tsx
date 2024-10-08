import { Requirement } from "components/[guild]/Requirements/components/Requirement"
import { RequirementWarningIcon } from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import { DataBlock } from "components/common/DataBlock"
import { PropsWithChildren } from "react"
import RequirementBaseCard from "./RequirementBaseCard"

type Props = {
  type: string
}

const UnsupportedRequirementTypeCard = ({
  type,
  children,
}: PropsWithChildren<Props>) => (
  <RequirementBaseCard>
    <Requirement image={<RequirementWarningIcon />}>
      {`Unsupported requirement type: `}
      <DataBlock>{type}</DataBlock>
    </Requirement>
    {children}
  </RequirementBaseCard>
)

export default UnsupportedRequirementTypeCard
