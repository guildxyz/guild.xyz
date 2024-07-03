import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { SignIn, Wallet } from "@phosphor-icons/react"
import { useSetAtom } from "jotai"
import shortenHex from "utils/shortenHex"
import JoinStep from "./JoinStep"

const WalletAuthButton = (): JSX.Element => {
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const { address } = useWeb3ConnectionManager()

  return (
    <JoinStep
      title="Sign in"
      isRequired
      icon={!address ? <SignIn /> : <Wallet />}
      isDone={!!address}
      buttonLabel={!address ? "Sign in" : shortenHex(address, 3)}
      colorScheme="gray"
      onClick={() => setIsWalletSelectorModalOpen(true)}
    />
  )
}

export default WalletAuthButton
