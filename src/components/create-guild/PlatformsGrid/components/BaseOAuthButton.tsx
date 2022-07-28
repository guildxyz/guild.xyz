import { Button, ButtonProps } from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import useOAuthWithCallback from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useOAuthWithCallback"
import { useSubmitWithSign } from "hooks/useSubmit"
import dynamic from "next/dynamic"
import { ArrowSquareIn, CaretRight } from "phosphor-react"
import { useMemo } from "react"
import { PlatformName } from "types"
import fetcher from "utils/fetcher"

type Props = {
  onSelection: (platform: PlatformName) => void
  platform: PlatformName
  buttonText: string
} & ButtonProps

const BaseOAuthButton = ({
  onSelection,
  platform,
  buttonText,
  ...buttonProps
}: Props) => {
  const { platformUsers, mutate } = useUser()
  const isPlatformConnected = platformUsers?.some(
    ({ platformName }) => platformName === platform
  )

  const { onSubmit, isSigning, signLoadingText, isLoading } = useSubmitWithSign(
    ({ data, validation }) =>
      fetcher("/user/connect", {
        method: "POST",
        body: { payload: data, ...validation },
      }),
    { onSuccess: () => mutate().then(() => onSelection(platform)) }
  )

  const { callbackWithOAuth, isAuthenticating, authData } = useOAuthWithCallback(
    platform,
    "guilds",
    () => {
      if (!isPlatformConnected) {
        onSubmit({
          platformName: platform,
          authData,
        })
      } else {
        onSelection(platform)
      }
    }
  )

  const DynamicCtaIcon = useMemo(
    () => dynamic(async () => (!isPlatformConnected ? ArrowSquareIn : CaretRight)),
    [isPlatformConnected]
  )

  return (
    <Button
      onClick={isPlatformConnected ? () => onSelection(platform) : callbackWithOAuth}
      isLoading={isAuthenticating || isLoading || isSigning}
      loadingText={
        signLoadingText ??
        ((isAuthenticating && "Check the popup window") || "Connecting")
      }
      rightIcon={<DynamicCtaIcon />}
      {...buttonProps}
    >
      {buttonText}
    </Button>
  )
}

export default BaseOAuthButton
