import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useGoogleAuthWithCallback from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useGoogleAuthWithCallback"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import dynamic from "next/dynamic"
import { ArrowSquareIn, CaretRight } from "phosphor-react"
import { useContext, useMemo } from "react"
import { PlatformName } from "types"

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
  } = useGoogleAuthWithCallback(() => onSelection("GOOGLE"))

  const DynamicCtaIcon = useMemo(
    () =>
      dynamic(async () =>
        !code && !isGoogleConnected ? ArrowSquareIn : CaretRight
      ),
    [code]
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
      isLoading={isAuthenticating}
      colorScheme="blue"
      loadingText={"Check the popup window"}
      rightIcon={<DynamicCtaIcon />}
    >
      Select document
    </Button>
  )
}

export default GoogleSelectButton
