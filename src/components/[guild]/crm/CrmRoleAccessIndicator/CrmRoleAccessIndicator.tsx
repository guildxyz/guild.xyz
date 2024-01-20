import { PopoverHeader } from "@chakra-ui/react"
import { POPOVER_HEADER_STYLES } from "components/[guild]/Requirements/components/RequiementAccessIndicator"
import { Check, X } from "phosphor-react"
import { CrmRole } from "../useMembers"
import CrmRoleAccessIndicatorUI from "./components/CrmRoleAccessIndicatorUI"

type Props = {
  memberRole: CrmRole
}

const CrmRoleAccessIndicator = ({ memberRole }: Props) => {
  if (!memberRole)
    return (
      <CrmRoleAccessIndicatorUI colorScheme={"gray"} icon={X}>
        <PopoverHeader {...POPOVER_HEADER_STYLES}>Role not satisfied</PopoverHeader>
      </CrmRoleAccessIndicatorUI>
    )

  return (
    <CrmRoleAccessIndicatorUI
      colorScheme={"green"}
      icon={Check}
      amount={memberRole.amount}
    >
      <PopoverHeader {...POPOVER_HEADER_STYLES}>Role satisfied</PopoverHeader>
    </CrmRoleAccessIndicatorUI>
  )
}

export default CrmRoleAccessIndicator
