import { useDisclosure } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import AccountModal from "components/common/Layout/components/Account/components/AccountModal"
import NetworkModal from "components/common/Layout/components/Account/components/NetworkModal/NetworkModal"
import { useRouter } from "next/router"
import { createContext, PropsWithChildren, useEffect } from "react"
import WalletSelectorModal from "./components/WalletSelectorModal"
import useEagerConnect from "./hooks/useEagerConnect"

const Web3Connection = createContext({
  triedEager: false,
  isWalletSelectorModalOpen: false,
  openWalletSelectorModal: () => {},
  closeWalletSelectorModal: () => {},
  isNetworkModalOpen: false,
  openNetworkModal: () => {},
  closeNetworkModal: () => {},
  isAccountModalOpen: false,
  openAccountModal: () => {},
  closeAccountModal: () => {},
})

const Web3ConnectionManager = ({
  children,
}: PropsWithChildren<any>): JSX.Element => {
  const { isActive } = useWeb3React()
  const router = useRouter()

  const {
    isOpen: isWalletSelectorModalOpen,
    onOpen: openWalletSelectorModal,
    onClose: closeWalletSelectorModal,
  } = useDisclosure()
  const {
    isOpen: isNetworkModalOpen,
    onOpen: openNetworkModal,
    onClose: closeNetworkModal,
  } = useDisclosure()
  const {
    isOpen: isAccountModalOpen,
    onOpen: openAccountModal,
    onClose: closeAccountModal,
  } = useDisclosure()

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  useEffect(() => {
    if (triedEager && !isActive && router.query.redirectUrl)
      openWalletSelectorModal()
  }, [triedEager, isActive, router.query])

  return (
    <Web3Connection.Provider
      value={{
        isWalletSelectorModalOpen,
        openWalletSelectorModal,
        closeWalletSelectorModal,
        triedEager,
        isNetworkModalOpen,
        openNetworkModal,
        closeNetworkModal,
        isAccountModalOpen,
        openAccountModal,
        closeAccountModal,
      }}
    >
      {children}
      <WalletSelectorModal
        isOpen={isWalletSelectorModalOpen}
        onOpen={openWalletSelectorModal}
        onClose={closeWalletSelectorModal}
      />
      <NetworkModal isOpen={isNetworkModalOpen} onClose={closeNetworkModal} />
      <AccountModal isOpen={isAccountModalOpen} onClose={closeAccountModal} />
    </Web3Connection.Provider>
  )
}
export { Web3Connection, Web3ConnectionManager }
