import { Icon } from "@chakra-ui/react"
import { Warning } from "phosphor-react"
import REQUIREMENTS from "requirements"
import { Requirement as RequirementType } from "types"
import DataBlock from "./DataBlock"
import RequiementAccessIndicator from "./RequiementAccessIndicator"
import Requirement from "./Requirement"
import { RequirementProvider } from "./RequirementContext"

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
    <RequirementProvider requirement={requirement}>
      <RequirementComponent rightElement={<RequiementAccessIndicator />} />
    </RequirementProvider>
  )
}

export default RequirementDisplayComponent
