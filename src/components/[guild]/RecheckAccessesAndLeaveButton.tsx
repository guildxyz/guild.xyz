import { ButtonGroup, Divider } from "@chakra-ui/react"
import LeaveButton from "./LeaveButton"
import { TopRecheckAccessesButton } from "./RecheckAccessesButton"

const RecheckAccessesAndLeaveButton = () => {
  return (
    <ButtonGroup isAttached>
      <TopRecheckAccessesButton />
      <Divider orientation="vertical" h="var(--chakra-sizes-11)" />
      <LeaveButton />
    </ButtonGroup>
  )
}

export { RecheckAccessesAndLeaveButton }
