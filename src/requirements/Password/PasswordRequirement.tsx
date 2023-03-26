import { Icon } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { Key } from "phosphor-react"
import SatisfyPassword from "./components/SatisfyPassword"

const PasswordRequirement = (props: RequirementProps): JSX.Element => (
  <Requirement
    image={<Icon as={Key} boxSize={6} />}
    footer={<SatisfyPassword />}
    {...props}
  >
    {"Meet password requirement"}
  </Requirement>
)

export default PasswordRequirement
