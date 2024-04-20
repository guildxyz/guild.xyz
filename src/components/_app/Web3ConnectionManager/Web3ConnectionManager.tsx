import ClientOnly from "components/common/ClientOnly"
import { useAtom } from "jotai"
import PlatformMergeErrorAlert from "./components/PlatformMergeErrorAlert"
import WalletLinkHelperModal from "./components/WalletLinkHelperModal"
import WalletSelectorModal, {
  walletSelectorModalAtom,
} from "./components/WalletSelectorModal"
import useAutoReconnect from "./hooks/useAutoReconnect"
import useConnectFromLocalStorage from "./hooks/useConnectFromLocalStorage"

const Web3ConnectionManager = () => {
  const [isWalletSelectorModalOpen, setIsWalletSelectorModalOpen] = useAtom(
    walletSelectorModalAtom
  )

  useAutoReconnect()
  useConnectFromLocalStorage()

  return (
    <ClientOnly>
      <WalletSelectorModal
        isOpen={isWalletSelectorModalOpen}
        onOpen={() => setIsWalletSelectorModalOpen(true)}
        onClose={() => setIsWalletSelectorModalOpen(false)}
      />
      <WalletLinkHelperModal />
      <PlatformMergeErrorAlert />
    </ClientOnly>
  )
}

export default Web3ConnectionManager
