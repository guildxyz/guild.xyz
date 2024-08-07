import { ButtonGroup, Divider } from "@chakra-ui/react"
import LeaveButton from "./LeaveButton"
import { TopRecheckAccessesButton } from "./RecheckAccessesButton"
import { useThemeContext } from "./ThemeContext"

const RecheckAccessesAndLeaveButton = () => {
  const { textColor, buttonColorScheme } = useThemeContext()

  const buttonProps = {
    color: textColor,
    colorScheme: buttonColorScheme,
  }

  return (
    <ButtonGroup isAttached>
      <TopRecheckAccessesButton {...buttonProps} />
      <Divider orientation="vertical" h="var(--chakra-sizes-11)" />
      <LeaveButton {...buttonProps} />
    </ButtonGroup>
  )
}

export { RecheckAccessesAndLeaveButton }
