import { Icon } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import { PiRobot } from "react-icons/pi"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import CompleteCaptcha from "./components/CompleteCaptcha"

const CaptchaRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()
  const captchaAge =
    requirement.data?.maxAmount > 0 &&
    formatRelativeTimeFromNow(requirement.data.maxAmount)

  return (
    <Requirement
      image={<Icon as={PiRobot} boxSize={6} />}
      footer={<CompleteCaptcha />}
      {...props}
    >
      {"Complete a CAPTCHA"}
      {captchaAge && (
        <>
          {` (valid until `}
          <DataBlock>{captchaAge}</DataBlock>
          {`)`}
        </>
      )}
    </Requirement>
  )
}

export default CaptchaRequirement
