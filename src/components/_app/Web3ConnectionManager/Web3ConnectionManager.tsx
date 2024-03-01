import ClientOnly from "components/common/ClientOnly"
import { useAtom } from "jotai"
import PlatformMergeErrorAlert from "./components/PlatformMergeErrorAlert"
import WalletSelectorModal, {
  walletSelectorModalAtom,
} from "./components/WalletSelectorModal"
import useConnectFromLocalStorage from "./hooks/useConnectFromLocalStorage"

const Web3ConnectionManager = () => {
  const [isWalletSelectorModalOpen, setIsWalletSelectorModalOpen] = useAtom(
    walletSelectorModalAtom,
  )

  useConnectFromLocalStorage()

  return (
    <ClientOnly>
      <WalletSelectorModal
        isOpen={isWalletSelectorModalOpen}
        onOpen={() => setIsWalletSelectorModalOpen(true)}
        onClose={() => setIsWalletSelectorModalOpen(false)}
      />
      <PlatformMergeErrorAlert />
    </ClientOnly>
  )
}

export default Web3ConnectionManager
