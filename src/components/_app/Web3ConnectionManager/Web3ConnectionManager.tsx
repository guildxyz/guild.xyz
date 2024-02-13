import ClientOnly from "components/common/ClientOnly"
import PlatformMergeErrorAlert from "./components/PlatformMergeErrorAlert"
import WalletSelectorModal from "./components/WalletSelectorModal"
import useConnectFromLocalStorage from "./hooks/useConnectFromLocalStorage"
import useWeb3ConnectionManager from "./hooks/useWeb3ConnectionManager"

const Web3ConnectionManager = () => {
  const {
    isWalletSelectorModalOpen,
    openWalletSelectorModal,
    closeWalletSelectorModal,
    isPlatformMergeAlertOpen,
    accountMergeAddress,
    accountMergePlatformName,
    closePlatformMergeAlert,
  } = useWeb3ConnectionManager()

  useConnectFromLocalStorage()

  return (
    <ClientOnly>
      <WalletSelectorModal
        isOpen={isWalletSelectorModalOpen}
        onOpen={openWalletSelectorModal}
        onClose={closeWalletSelectorModal}
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
