import ClientOnly from "components/common/ClientOnly"
import { useAtom } from "jotai"
import PlatformMergeErrorAlert from "./components/PlatformMergeErrorAlert"
import WalletSelectorModal, {
  walletSelectorModalAtom,
} from "./components/WalletSelectorModal"
import useConnectFromLocalStorage from "./hooks/useConnectFromLocalStorage"
import useWeb3ConnectionManager from "./hooks/useWeb3ConnectionManager"

const Web3ConnectionManager = () => {
  const {
    isPlatformMergeAlertOpen,
    accountMergeAddress,
    accountMergePlatformName,
    closePlatformMergeAlert,
  } = useWeb3ConnectionManager()

  const [isWalletSelectorModalOpen, setIsWalletSelectorModalOpen] = useAtom(
    walletSelectorModalAtom
  )

  useConnectFromLocalStorage()

  return (
    <ClientOnly>
      <WalletSelectorModal
        isOpen={isWalletSelectorModalOpen}
        onOpen={() => setIsWalletSelectorModalOpen(true)}
        onClose={() => setIsWalletSelectorModalOpen(false)}
      />
      <PlatformMergeErrorAlert
        onClose={closePlatformMergeAlert}
        isOpen={isPlatformMergeAlertOpen}
        addressOrDomain={accountMergeAddress}
        platformName={accountMergePlatformName}
      />
    </ClientOnly>
  )
}

export default Web3ConnectionManager
