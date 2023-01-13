import { Icon } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { Warning } from "phosphor-react"
import REQUIREMENTS from "requirements"
import Requirement from "requirements/common/Requirement"
import { Requirement as RequirementType } from "types"
import RequiementAccessIndicator from "./RequiementAccessIndicator"

type Props = {
  requirement: RequirementType
}

const RequirementDisplayComponent = ({ requirement }: Props) => {
  const RequirementComponent = REQUIREMENTS[requirement.type]?.displayComponent

  if (!RequirementComponent)
    return (
      <Requirement image={<Icon as={Warning} boxSize={5} color="orange.300" />}>
        {`Unsupported requirement type: `}
        <DataBlock>{requirement.type}</DataBlock>
      </Requirement>
    )

  return (
    <RequirementComponent
      requirement={requirement}
      rightElement={<RequiementAccessIndicator requirement={requirement} />}
    />
  )
}

export default RequirementDisplayComponent
