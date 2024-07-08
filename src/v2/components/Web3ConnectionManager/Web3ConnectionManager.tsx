import useAutoReconnect from "@/hooks/useAutoReconnect"
import { useAtom } from "jotai"
import { walletSelectorModalAtom } from "../Providers/atoms"
import { useTriggerWalletSelectorModal } from "./hooks/useTriggerWalletSelectorModal"
import WalletLinkHelperModal from "./WalletLinkHelperModal"
import WalletSelectorModal from "./WalletSelectorModal"

export function Web3ConnectionManagerBase() {
  const [isWalletSelectorModalOpen, setIsWalletSelectorModalOpen] = useAtom(
    walletSelectorModalAtom
  )

  useAutoReconnect()
  // TODO
  // useConnectFromLocalStorage()

  // TODO
  return (
    <>
      <WalletSelectorModal
        isOpen={isWalletSelectorModalOpen}
        onOpen={() => setIsWalletSelectorModalOpen(true)}
        onClose={() => setIsWalletSelectorModalOpen(false)}
      />
      <WalletLinkHelperModal />
      {/*
      <PlatformMergeErrorAlert /> */}
    </>
  )
}

export function Web3ConnectionManager() {
  useTriggerWalletSelectorModal()
  return <Web3ConnectionManagerBase />
}
