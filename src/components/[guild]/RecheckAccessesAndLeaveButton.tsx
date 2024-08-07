import { ButtonGroup, Divider } from "@chakra-ui/react"
import LeaveButton from "./LeaveButton"
import { TopRecheckAccessesButton } from "./RecheckAccessesButton"

const RecheckAccessesAndLeaveButton = () => {
  return (
    <ButtonGroup isAttached>
      <TopRecheckAccessesButton />
      <Divider orientation="vertical" h={10} />
      <LeaveButton />
    </ButtonGroup>
  )
}

export { RecheckAccessesAndLeaveButton }
