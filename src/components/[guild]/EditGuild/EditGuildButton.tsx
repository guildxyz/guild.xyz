import { IconButton } from "@chakra-ui/react"
import OnboardingMarker from "components/common/OnboardingMarker"
import { GearSix } from "phosphor-react"
import { useThemeContext } from "../ThemeContext"
import { useEditGuildDrawer } from "./EditGuildDrawerContext"

const EditGuildButton = (): JSX.Element => {
  const { onOpen } = useEditGuildDrawer()

  const { textColor, buttonColorScheme } = useThemeContext()

  return (
    <OnboardingMarker step={1}>
      <IconButton
        icon={<GearSix />}
        aria-label="Edit Guild"
        minW={"44px"}
        rounded="full"
        colorScheme={buttonColorScheme}
        color={textColor}
        onClick={onOpen}
      />
    </OnboardingMarker>
  )
}

export default EditGuildButton
