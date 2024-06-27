import ClientOnly from "components/common/ClientOnly"
import { useAtom } from "jotai"
import { walletSelectorModalAtom } from "./components/WalletSelectorModal"
import useAutoReconnect from "./hooks/useAutoReconnect"
import useConnectFromLocalStorage from "./hooks/useConnectFromLocalStorage"
import {
  useTriggerWalletSelectorModal,
  useTriggerWalletSelectorModalLegacy,
} from "./hooks/useWeb3ConnectionManager"

const BaseWeb3ConnectionManager = () => {
  const [isWalletSelectorModalOpen, setIsWalletSelectorModalOpen] = useAtom(
    walletSelectorModalAtom
  )

  useAutoReconnect()
  useConnectFromLocalStorage()

  return (
    <ClientOnly>
      {/* <WalletSelectorModal
        isOpen={isWalletSelectorModalOpen}
        onOpen={() => setIsWalletSelectorModalOpen(true)}
        onClose={() => setIsWalletSelectorModalOpen(false)}
      />
      <WalletLinkHelperModal />
      <PlatformMergeErrorAlert /> */}
    </ClientOnly>
  )
}

// Uses useRouter from next/router (works in pages router)
const LegacyWeb3ConnectionManager = () => {
  useTriggerWalletSelectorModalLegacy()
  return <BaseWeb3ConnectionManager />
}

// Uses useRouter from next/navigation (works in app router)
const Web3ConnectionManager = () => {
  useTriggerWalletSelectorModal()
  return <BaseWeb3ConnectionManager />
}

export default LegacyWeb3ConnectionManager
export { Web3ConnectionManager }
