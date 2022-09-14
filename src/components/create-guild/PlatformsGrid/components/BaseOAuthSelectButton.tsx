import { ButtonProps } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useDisconnect from "components/common/Layout/components/Account/components/AccountModal/hooks/useDisconnect"
import useUser from "components/[guild]/hooks/useUser"
import useOAuthWithCallback from "components/[guild]/JoinModal/hooks/useOAuthWithCallback"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import useGateables from "hooks/useGateables"
import { manageKeyPairAfterUserMerge } from "hooks/useKeyPair"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import dynamic from "next/dynamic"
import { ArrowSquareIn, CaretRight } from "phosphor-react"
import { useContext, useMemo } from "react"
import { PlatformName } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"

type Props = {
  onSelection: (platform: PlatformName) => void
  platform: PlatformName
  buttonText: string
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
  ...buttonProps
}: Props) => {
  const showErrorToast = useShowErrorToast()

  const user = useUser()
  const isPlatformConnected = user.platformUsers?.some(
    ({ platformName, platformUserData }) =>
      platformName === platform && !platformUserData?.readonly
  )

  const disconnect = useDisconnect(() => user.mutate())
  const {
    gateables,
    isLoading: isGateablesLoading,
    mutate: mutateGateables,
  } = useGateables(platform, {
    onError: () => {
      if (isPlatformConnected) {
        disconnect.onSubmit({ platformName: platform })
      }
    },
    dedupingInterval: 30_000,
  })
  const { account } = useWeb3React()

  const scope = "repo,read:user"

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
    () =>
      dynamic(async () =>
        !isPlatformConnected || !!gateables.error ? ArrowSquareIn : CaretRight
      ),
    [isPlatformConnected, gateables]
  )

  const { openWalletSelectorModal } = useContext(Web3Connection)

  if (!account) {
    return (
      <Button {...buttonProps} onClick={openWalletSelectorModal}>
        Connect Wallet
      </Button>
    )
  }

  return (
    <Button
      onClick={isPlatformConnected ? () => onSelection(platform) : callbackWithOAuth}
      isLoading={
        user?.isLoading ||
        isAuthenticating ||
        isLoading ||
        isSigning ||
        isGateablesLoading ||
        disconnect.isLoading ||
        disconnect.isSigning
      }
      loadingText={
        signLoadingText ??
        ((isAuthenticating && "Check the popup window") ||
          ((isGateablesLoading ||
            disconnect.isLoading ||
            disconnect.isSigning ||
            user?.isLoading) &&
            "Checking account") ||
          "Connecting")
      }
      rightIcon={<DynamicCtaIcon />}
      {...buttonProps}
    >
      {buttonText}
    </Button>
  )
}

export default BaseOAuthSelectButton
