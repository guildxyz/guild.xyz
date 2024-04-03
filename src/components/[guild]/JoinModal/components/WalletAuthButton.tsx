import useUser from "components/[guild]/hooks/useUser"
import { walletSelectorModalAtom } from "components/_app/Web3ConnectionManager/components/WalletSelectorModal"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useSetAtom } from "jotai"
import { EnvelopeSimple, SignIn, Wallet } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import { useAccount } from "wagmi"
import JoinStep from "./JoinStep"

const WalletAuthButton = (): JSX.Element => {
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const { address } = useWeb3ConnectionManager()
  const { connector } = useAccount()
  const { emails } = useUser()

  const isGoogleLogin = connector?.id === "coinbaseWalletSDK"

  return (
    <JoinStep
      title="Sign in"
      isRequired
      icon={!address ? <SignIn /> : isGoogleLogin ? <EnvelopeSimple /> : <Wallet />}
      isDone={!!address}
      buttonLabel={
        !address
          ? "Sign in"
          : isGoogleLogin
          ? emails?.emailAddress
          : shortenHex(address, 3)
      }
      colorScheme="gray"
      onClick={() => setIsWalletSelectorModalOpen(true)}
    />
  )
}

export default WalletAuthButton
