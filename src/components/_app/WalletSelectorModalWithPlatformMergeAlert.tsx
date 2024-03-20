import ClientOnly from "components/common/ClientOnly"
import { useAtom } from "jotai"
import PlatformMergeErrorAlert from "./Web3ConnectionManager/components/PlatformMergeErrorAlert"
import WalletSelectorModal, {
  walletSelectorModalAtom,
} from "./Web3ConnectionManager/components/WalletSelectorModal"

const WalletSelectorModalWithPlatformMergeAlert = () => {
  const [isWalletSelectorModalOpen, setIsWalletSelectorModalOpen] = useAtom(
    walletSelectorModalAtom
  )
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

export default WalletSelectorModalWithPlatformMergeAlert
