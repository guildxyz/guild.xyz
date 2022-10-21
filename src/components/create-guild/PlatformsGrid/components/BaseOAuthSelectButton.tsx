import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useUser from "components/[guild]/hooks/useUser"
import useOAuthWithCallback from "components/[guild]/JoinModal/hooks/useOAuthWithCallback"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import useGateables from "hooks/useGateables"
import { manageKeyPairAfterUserMerge } from "hooks/useKeyPair"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import dynamic from "next/dynamic"
import { ArrowSquareIn, CaretRight } from "phosphor-react"
import platforms from "platforms"
import { useContext, useMemo } from "react"
import { PlatformName } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"

type Props = {
  onSelection: (platform: PlatformName) => void
  platform: PlatformName
}

/**
 * Started as a general abstraction, but is only used for GitHub so got some GitHub
 * specific stuff in it (scope, readonly). Don't know if we want to generalize it in
 * the future or not so keeping it like this for now
 */
const BaseOAuthSelectButton = ({ onSelection, platform }: Props) => {
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

  const { scope } = platforms?.[platform]?.oauthParams ?? {}

  const { callbackWithOAuth, isAuthenticating, authData } = useOAuthWithCallback(
    platform,
    () => {
      if (!isPlatformConnected) {
        onSubmit({
          platformName: platform,
          authData: { ...authData, scope: scope.creation },
        })
      } else {
        onSelection(platform)
      }
    },
    "creation"
  )
  const DynamicCtaIcon = useMemo(
    () => dynamic(async () => (!isPlatformConnected ? ArrowSquareIn : CaretRight)),
    [isPlatformConnected]
  )

  const { openWalletSelectorModal } = useContext(Web3Connection)

  if (!account) {
    return (
      <Button
        colorScheme={platforms?.[platform]?.colorScheme}
        onClick={openWalletSelectorModal}
      >
        Connect Wallet
      </Button>
    )
  }

  return (
    <Button
      colorScheme={platforms?.[platform]?.colorScheme}
      onClick={isPlatformConnected ? () => onSelection(platform) : callbackWithOAuth}
      isLoading={user?.isLoading || isAuthenticating || isLoading || isSigning}
      loadingText={
        signLoadingText ??
        ((isAuthenticating && "Check the popup window") ||
          (user?.isLoading && "Checking account") ||
          "Connecting")
      }
      rightIcon={<DynamicCtaIcon />}
    >
      Select {platforms?.[platform]?.gatedEntity}
    </Button>
  )
}

export default BaseOAuthSelectButton
