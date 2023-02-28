import { ButtonProps } from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import useOAuthWithCallback from "components/[guild]/JoinModal/hooks/useOAuthWithCallback"
import useGateables from "hooks/useGateables"
import useShowErrorToast from "hooks/useShowErrorToast"
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
  scope?: string
} & ButtonProps

/**
 * Started as a general abstraction, but is only used for GitHub so got some GitHub
 * specific stuff in it (scope, readonly). Don't know if we want to generalize it in
 * the future or not so keeping it like this for now
 */
const useOAuthButtonProps = ({ onSelection, platform }: Props) => {
  const showErrorToast = useShowErrorToast()

  const scope =
    platform === "GITHUB" ? "repo,read:user" : "guilds identify guilds.members.read"

  const user = useUser()
  const isPlatformConnected = user.platformUsers?.some(
    ({ platformName, platformUserData }) =>
      platformName === platform && !platformUserData?.readonly
  )

  const { mutate: mutateGateables } = useGateables(platform)

  const { onSubmit, isSigning, signLoadingText, isLoading } = useSubmitWithSign(
    (signedValidation) =>
      fetcher("/user/connect", {
        method: "POST",
        ...signedValidation,
      }),
    {
      onSuccess: async () => {
        await user.mutate()
        await mutateGateables()
        onSelection(platform)
      },
      onError: (err) => showErrorToast(err),
    }
  )

  const { callbackWithOAuth, isAuthenticating, authData } = useOAuthWithCallback(
    platform,
    scope,
    () => {
      if (!isPlatformConnected) {
        onSubmit({
          platformName: platform,
          authData: { ...authData, scope },
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

  return {
    onClick: isPlatformConnected ? () => onSelection(platform) : callbackWithOAuth,
    isLoading: user?.isLoading || isAuthenticating || isLoading || isSigning,
    loadingText:
      signLoadingText ??
      ((isAuthenticating && "Check the popup window") ||
        (user?.isLoading && "Checking account") ||
        "Connecting"),
    rightIcon: DynamicCtaIcon,
  }
}

export default useOAuthButtonProps
