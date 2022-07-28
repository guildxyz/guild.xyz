import { Button, ButtonProps } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useDisconnect from "components/common/Layout/components/Account/components/AccountModal/hooks/useDisconnect"
import useUser from "components/[guild]/hooks/useUser"
import useOAuthWithCallback from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useOAuthWithCallback"
import useGateables from "hooks/useGateables"
import { useSubmitWithSign } from "hooks/useSubmit"
import dynamic from "next/dynamic"
import { ArrowSquareIn, CaretRight } from "phosphor-react"
import { useEffect, useMemo } from "react"
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

  // TODO Do this with SWR once keypair is merged
  const gateables = useGateables()
  const disconnect = useDisconnect()
  const { account } = useWeb3React()
  useEffect(() => {
    if (!account) return
    gateables.onSubmit({ platformName: platform })
  }, [account])

  const { onSubmit, isSigning, signLoadingText, isLoading } = useSubmitWithSign(
    ({ data, validation }) =>
      fetcher("/user/connect", {
        method: "POST",
        body: { payload: data, ...validation },
      }),
    { onSuccess: () => mutate().then(() => onSelection(platform)) }
  )

  useEffect(() => {
    if (disconnect.response) {
      onSubmit({
        platformName: platform,
        authData,
      })
    }
  }, [disconnect.response])

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
      onClick={
        isPlatformConnected
          ? !!gateables.error
            ? () =>
                disconnect.onSubmit({
                  platformName: platform,
                })
            : () => onSelection(platform)
          : callbackWithOAuth
      }
      isLoading={
        isAuthenticating ||
        isLoading ||
        isSigning ||
        gateables.isLoading ||
        gateables.isSigning ||
        disconnect.isLoading ||
        disconnect.isSigning
      }
      loadingText={
        signLoadingText ??
        gateables.signLoadingText ??
        disconnect.signLoadingText ??
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
