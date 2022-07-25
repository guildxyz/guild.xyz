import Button from "components/common/Button"
import useGoogleAuthWithCallback from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useGoogleAuthWithCallback"
import dynamic from "next/dynamic"
import { ArrowSquareIn, CaretRight } from "phosphor-react"
import { useMemo } from "react"
import { PlatformName } from "types"

type Props = {
  onSelection: (platform: PlatformName) => void
}

const GoogleSelectButton = ({ onSelection }: Props) => {
  const { callbackWithGoogleAuth, isAuthenticating, signLoadingText, code } =
    useGoogleAuthWithCallback(() => onSelection("GOOGLE"))

  const DynamicCtaIcon = useMemo(
    () => dynamic(async () => (!code ? ArrowSquareIn : CaretRight)),
    [code]
  )

  return (
    <Button
      onClick={callbackWithGoogleAuth}
      isLoading={isAuthenticating}
      colorScheme="blue"
      loadingText={signLoadingText ?? "Check the popup window"}
      rightIcon={<DynamicCtaIcon />}
    >
      Select document
    </Button>
  )
}

export default GoogleSelectButton
