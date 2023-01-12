import { ButtonProps } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useUser from "components/[guild]/hooks/useUser"
import useOAuthWithCallback from "components/[guild]/JoinModal/hooks/useOAuthWithCallback"
import useGateables from "hooks/useGateables"
import { manageKeyPairAfterUserMerge } from "hooks/useKeyPair"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import dynamic from "next/dynamic"
import { ArrowSquareIn, CaretRight } from "phosphor-react"
import { useMemo } from "react"
import { PlatformName } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"
import ConnectWalletButton from "./ConnectWalletButton"

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
const BaseOAuthSelectButton = ({
  onSelection,
  platform,
  buttonText,
  scope,
  ...buttonProps
}: Props) => {
  const showErrorToast = useShowErrorToast()

  const user = useUser()
  const isPlatformConnected = user.platformUsers?.some(
    ({ platformName, platformUserData }) =>
      platformName === platform && !platformUserData?.readonly
  )

  const { mutate: mutateGateables } = useGateables(platform)
  const { account } = useWeb3React()

  const fetcherWithSign = useFetcherWithSign()

  const { onSubmit, isSigning, signLoadingText, isLoading } = useSubmitWithSign(
    ({ data, validation }) =>
      fetcher("/user/connect", {
        method: "POST",
        body: { payload: data, ...validation },
      }).then(() => manageKeyPairAfterUserMerge(fetcherWithSign, user, account)),
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

  if (!account) return <ConnectWalletButton />

  return (
    <Button
      onClick={isPlatformConnected ? () => onSelection(platform) : callbackWithOAuth}
      isLoading={user?.isLoading || isAuthenticating || isLoading || isSigning}
      loadingText={
        signLoadingText ??
        ((isAuthenticating && "Check the popup window") ||
          (user?.isLoading && "Checking account") ||
          "Connecting")
      }
      rightIcon={<DynamicCtaIcon />}
      {...buttonProps}
      data-dd-action-name={buttonText}
    >
      {buttonText}
    </Button>
  )
}

export default BaseOAuthSelectButton
