import { useAutoReconnect } from "@/hooks/useAutoReconnect"
import { useAtom } from "jotai"
import { walletSelectorModalAtom } from "../Providers/atoms"
import { PlatformMergeErrorAlert } from "./PlatformMergeErrorAlert"
import WalletLinkHelperModal from "./WalletLinkHelperModal"
import WalletSelectorModal from "./WalletSelectorModal"
import useConnectFromLocalStorage from "./hooks/useConnectFromLocalStorage"
import { useTriggerWalletSelectorModal } from "./hooks/useTriggerWalletSelectorModal"

export function Web3ConnectionManagerBase() {
  const [isWalletSelectorModalOpen, setIsWalletSelectorModalOpen] = useAtom(
    walletSelectorModalAtom
  )

  useAutoReconnect()
  useConnectFromLocalStorage()

  return (
    <>
      <WalletSelectorModal
        isOpen={isWalletSelectorModalOpen}
        onOpen={() => setIsWalletSelectorModalOpen(true)}
        onClose={() => setIsWalletSelectorModalOpen(false)}
      />
      <WalletLinkHelperModal />
      <PlatformMergeErrorAlert />
    </>
  )
}

export function Web3ConnectionManager() {
  useTriggerWalletSelectorModal()

  return <Web3ConnectionManagerBase />
}
