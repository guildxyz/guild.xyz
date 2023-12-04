import ClientOnly from "components/common/ClientOnly"
import useContractWalletInfoToast from "hooks/useContractWalletInfoToast"
import { useEffect } from "react"
import type { CWaaSConnector } from "waasConnector"
import { useConnect } from "wagmi"
import PlatformMergeErrorAlert from "./components/PlatformMergeErrorAlert"
import WalletSelectorModal from "./components/WalletSelectorModal"
import useConnectFromLocalStorage from "./hooks/useConnectFromLocalStorage"
import useNewSharedSocialsToast from "./hooks/useNewSharedSocialsToast"
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
    openAccountModal,
  } = useWeb3ConnectionManager()

  useContractWalletInfoToast()
  useConnectFromLocalStorage()
  useNewSharedSocialsToast(openAccountModal)

  // TODO Move to separate hook
  const { connectors, connect } = useConnect()
  // Auto connect to CWaaS if there is a wallet within the sandbox
  useEffect(() => {
    const cwaasConnector = connectors.find(
      ({ id }) => id === "cwaasWallet"
    ) as CWaaSConnector
    cwaasConnector.getProvider().then((waas) => {
      if (!!waas.wallets.wallet) {
        connect({ connector: cwaasConnector })
      }
    })
  }, [])

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
