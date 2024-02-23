import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  CloseButton,
} from "@chakra-ui/react"
import useLocalStorage from "hooks/useLocalStorage"
import { checkUserAgentData, checkUserAgentIncludes } from "../utils/userAgentCheck"

const isWebView =
  checkUserAgentIncludes("webview") ||
  checkUserAgentData((brand) => brand.includes("webview"))

const isBrave = checkUserAgentData((brand) => brand === "brave")

const googleLoginCheckResult =
  !isWebView && !isBrave
    ? null
    : isWebView
    ? "Google login doesn't work in embedded browsers, please use a native browser application"
    : "You might need to disable the Brave Shields (Brave logo next to the URL bar) for Google login to work"

const UserAgentAlert = () => {
  const [isDismissed, setIsDismissed] = useLocalStorage(
    "google_login_warning_dismissed",
    false
  )

  if (!googleLoginCheckResult || isDismissed) {
    return null
  }

  return (
    <Alert mb={4} status="warning">
      <AlertIcon />
      <Box>
        <AlertDescription>{googleLoginCheckResult}</AlertDescription>
      </Box>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={() => setIsDismissed(true)}
      />
    </Alert>
  )
}

export default UserAgentAlert
