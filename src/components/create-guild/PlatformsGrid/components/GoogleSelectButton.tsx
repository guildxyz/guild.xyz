import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useUser from "components/[guild]/hooks/useUser"
import useGoogleAuthWithCallback from "components/[guild]/JoinModal/hooks/useGoogleAuthWithCallback"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { manageKeyPairAfterUserMerge } from "hooks/useKeyPair"
import { useSubmitWithSign } from "hooks/useSubmit"
import dynamic from "next/dynamic"
import { ArrowSquareIn, CaretRight } from "phosphor-react"
import { useContext, useMemo } from "react"
import { PlatformName } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"

type Props = {
  onSelection: (platform: PlatformName) => void
}

const GoogleSelectButton = ({ onSelection }: Props) => {
  const {
    callbackWithGoogleAuth,
    isAuthenticating,
    code,
    authData,
    isGoogleConnected,
  } = useGoogleAuthWithCallback(() =>
    onSubmit({
      platformName: "GOOGLE",
      authData,
    })
  )

  const DynamicCtaIcon = useMemo(
    () =>
      dynamic(async () =>
        !code && !isGoogleConnected ? ArrowSquareIn : CaretRight
      ),
    [code, isGoogleConnected]
  )

  const user = useUser()
  const fetcherWithSign = useFetcherWithSign()

  const { onSubmit, isSigning, signLoadingText, isLoading } = useSubmitWithSign(
    (signedValidation) =>
      fetcher("/user/connect", {
        method: "POST",
        ...signedValidation,
      }).then(() => manageKeyPairAfterUserMerge(fetcherWithSign, user, account)),
    { onSuccess: () => onSelection("GOOGLE") }
  )

  const { account } = useWeb3React()
  const { openWalletSelectorModal } = useContext(Web3Connection)

  if (!account) {
    return (
      <Button colorScheme="blue" onClick={openWalletSelectorModal}>
        Connect Wallet
      </Button>
    )
  }

  return (
    <Button
      onClick={
        isGoogleConnected ? () => onSelection("GOOGLE") : callbackWithGoogleAuth
      }
      isLoading={isAuthenticating || isSigning || isLoading}
      colorScheme="blue"
      loadingText={
        signLoadingText ||
        (isAuthenticating && "Check the popup window") ||
        "Connecting"
      }
      rightIcon={<DynamicCtaIcon />}
    >
      Select document
    </Button>
  )
}

export default GoogleSelectButton
