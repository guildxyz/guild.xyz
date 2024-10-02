import { cn } from "@/lib/utils"
import { ButtonGroup, Divider } from "@chakra-ui/react"
import LeaveButton from "./LeaveButton"
import { TopRecheckAccessesButton } from "./RecheckAccessesButton"
import { useThemeContext } from "./ThemeContext"

const RecheckAccessesAndLeaveButton = () => {
  const { textColor, buttonColorScheme, buttonColorSchemeClassName } =
    useThemeContext()

  const chakraButtonProps = {
    color: textColor,
    colorScheme: buttonColorScheme,
  }

  return (
    <ButtonGroup isAttached>
      <TopRecheckAccessesButton
        // TODO: find a better solution for this once we migrate the whole guild page to Tailwind
        className={cn(
          buttonColorSchemeClassName,
          "h-11 rounded-r-none text-banner-foreground"
        )}
      />
      <Divider orientation="vertical" h="var(--chakra-sizes-11)" />
      <LeaveButton {...chakraButtonProps} />
    </ButtonGroup>
  )
}

export { RecheckAccessesAndLeaveButton }
