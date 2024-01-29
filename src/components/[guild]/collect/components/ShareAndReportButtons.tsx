import { HStack } from "@chakra-ui/react"
import ReportGuildButton from "components/[guild]/ReportGuildButton"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import PulseMarker from "components/common/PulseMarker"
import useLocalStorage from "hooks/useLocalStorage"
import ShareButton from "./ShareButton"

type Props = {
  isPulseMarkerHidden?: boolean
  shareButtonLocalStorageKey: string
  shareText: string
}

const ShareAndReportButtons = ({
  isPulseMarkerHidden,
  shareButtonLocalStorageKey,
  shareText,
}: Props) => {
  const { isAdmin } = useGuildPermission()
  const { textColor, buttonColorScheme } = useThemeContext()

  const [hasClickedShareButton, setHasClickedShareButton] = useLocalStorage(
    shareButtonLocalStorageKey,
    false
  )

  return (
    <HStack>
      <PulseMarker
        placement="top"
        hidden={!isAdmin || hasClickedShareButton || isPulseMarkerHidden}
      >
        <ShareButton
          shareText={shareText}
          onClick={() => setHasClickedShareButton(true)}
        />
      </PulseMarker>
      {!isAdmin && (
        <ReportGuildButton
          layout="ICON"
          colorScheme={buttonColorScheme}
          color={textColor}
        />
      )}
    </HStack>
  )
}
export default ShareAndReportButtons
