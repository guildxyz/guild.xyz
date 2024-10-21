import { Robot } from "@phosphor-icons/react/dist/ssr"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import CompleteCaptcha from "./components/CompleteCaptcha"

const CaptchaRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()
  const captchaAge =
    requirement.data?.maxAmount > 0 &&
    formatRelativeTimeFromNow(requirement.data.maxAmount)

  return (
    <Requirement
      image={<Robot weight="bold" className="size-6" />}
      footer={<CompleteCaptcha />}
      {...props}
    >
      <span>Complete a CAPTCHA</span>
      {captchaAge && (
        <>
          <span>{" (valid until "}</span>
          <DataBlock>{captchaAge}</DataBlock>
          <span>{")"}</span>
        </>
      )}
    </Requirement>
  )
}

export default CaptchaRequirement
