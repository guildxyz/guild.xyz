import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useUser from "components/[guild]/hooks/useUser"
import useGoogleAuthWithCallback from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useGoogleAuthWithCallback"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { useSubmitWithSign } from "hooks/useSubmit"
import dynamic from "next/dynamic"
import { ArrowSquareIn, CaretRight } from "phosphor-react"
import { useContext, useMemo } from "react"
import { PlatformName } from "types"
import fetcher from "utils/fetcher"

type Props = {
  onSelection: (platform: PlatformName) => void
}

const GoogleSelectButton = ({ onSelection }: Props) => {
  const {
    callbackWithGoogleAuth,
    isAuthenticating,
    // signLoadingText,
    code,
    isGoogleConnected,
    redirectUri,
  } = useGoogleAuthWithCallback(() =>
    onSubmit({
      platformName: "GOOGLE",
      authData: { code, redirect_url: redirectUri },
    })
  )

  const DynamicCtaIcon = useMemo(
    () =>
      dynamic(async () =>
        !code && !isGoogleConnected ? ArrowSquareIn : CaretRight
      ),
    [code]
  )

  const { mutate } = useUser()

  const { onSubmit, isSigning, signLoadingText, isLoading } = useSubmitWithSign(
    ({ data, validation }) =>
      fetcher("/user/connect", {
        method: "POST",
        body: { payload: data, ...validation },
      }),
    { onSuccess: () => mutate().then(() => onSelection("GOOGLE")) }
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
      onClick={callbackWithGoogleAuth}
      isLoading={isAuthenticating || isSigning || isLoading}
      colorScheme="blue"
      loadingText={signLoadingText || "Check the popup window"}
      rightIcon={<DynamicCtaIcon />}
    >
      Select document
    </Button>
  )
}

export default GoogleSelectButton
