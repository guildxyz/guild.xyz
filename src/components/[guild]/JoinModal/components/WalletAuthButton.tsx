import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { SignIn, Wallet } from "@phosphor-icons/react/dist/ssr"
import { useSetAtom } from "jotai"
import shortenHex from "utils/shortenHex"
import { JoinStep } from "./JoinStep"

const WalletAuthButton = (): JSX.Element => {
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const { address } = useWeb3ConnectionManager()

  return (
    <JoinStep
      isDone={!!address}
      title="Sign in"
      isRequired
      buttonProps={{
        leftIcon: !address ? <SignIn weight="bold" /> : <Wallet weight="bold" />,
        onClick: () => setIsWalletSelectorModalOpen(true),
        children: !address ? "Sign in" : shortenHex(address, 3),
      }}
    />
  )
}

export default WalletAuthButton
