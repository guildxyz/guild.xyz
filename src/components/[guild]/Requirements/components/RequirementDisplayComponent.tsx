import { Icon } from "@chakra-ui/react"
import { Question, Warning } from "phosphor-react"
import REQUIREMENTS from "requirements"
import { Requirement as RequirementType, Rest } from "types"
import DataBlock from "./DataBlock"
import RequiementAccessIndicator from "./RequiementAccessIndicator"
import Requirement from "./Requirement"
import { RequirementProvider } from "./RequirementContext"

type Props = {
  requirement: RequirementType
  rightElement?: JSX.Element
} & Rest

const RequirementDisplayComponent = ({
  requirement,
  rightElement,
  ...rest
}: Props) => {
  if ((requirement as any).isHidden) {
    return (
      <Requirement image={<Icon as={Question} boxSize={5} />}>
        Some secret requirements
      </Requirement>
    )
  }

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
      <RequirementComponent
        rightElement={rightElement ?? <RequiementAccessIndicator />}
        {...rest}
      />
    </RequirementProvider>
  )
}

export default RequirementDisplayComponent
