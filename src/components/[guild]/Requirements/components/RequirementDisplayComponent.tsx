import { Icon } from "@chakra-ui/react"
import { Question, Warning } from "phosphor-react"
import REQUIREMENTS from "requirements"
import { Requirement as RequirementType, Rest } from "types"
import DataBlock from "./DataBlock"
import HiddenRequiementAccessIndicator from "./HiddenRequiementAccessIndicator"
import RequiementAccessIndicator from "./RequiementAccessIndicator"
import Requirement from "./Requirement"
import { RequirementProvider } from "./RequirementContext"

type Props = {
  requirement: RequirementType
  rightElement?: JSX.Element
} & Rest

const RequirementDisplayComponent = ({
  requirement,
  rightElement = <RequiementAccessIndicator />,
  ...rest
}: Props) => {
  if (requirement.type === "HIDDEN")
    return (
      <Requirement
        image={<Icon as={Question} boxSize={5} />}
        rightElement={
          <HiddenRequiementAccessIndicator roleId={requirement.roleId} />
        }
      >
        Some secret requirements
      </Requirement>
    )

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
      <RequirementComponent rightElement={rightElement} {...rest} />
    </RequirementProvider>
  )
}

export default RequirementDisplayComponent
