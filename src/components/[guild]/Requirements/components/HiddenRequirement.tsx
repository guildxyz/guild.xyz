import { Icon, Tooltip } from "@chakra-ui/react"
import useAccess from "components/[guild]/hooks/useAccess"
import { Info, Question } from "phosphor-react"
import Requirement from "./Requirement"

const HiddenRequirement = ({ roleId }) => {
  const { data, hasAccess } = useAccess(roleId)

  return (
    <Requirement
      image={<Icon as={Question} boxSize={5} />}
      rightElement={
        !hasAccess && data?.errors ? (
          <Tooltip label="You may have to connect some social account(s) to check access for the secret requirement(s)">
            <Info />
          </Tooltip>
        ) : null
      }
    >
      Some secret requirements
    </Requirement>
  )
}

export default HiddenRequirement
