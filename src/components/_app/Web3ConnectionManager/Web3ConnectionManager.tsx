import { useDisclosure } from "@chakra-ui/react"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { useWeb3React } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import AccountModal from "components/common/Layout/components/Account/components/AccountModal"
import NetworkModal from "components/common/Layout/components/Account/components/NetworkModal/NetworkModal"
import requestNetworkChangeHandler from "components/common/Layout/components/Account/components/NetworkModal/utils/requestNetworkChange"
import { Chains, RPC } from "connectors"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"
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
  requestNetworkChange: (
    chainId: number,
    callback?: () => void,
    errorHandler?: (err) => void
  ) => {},
  isDelegateConnection: false,
  setIsDelegateConnection: (_: boolean) => {},
  isNetworkChangeInProgress: false,
})

const Web3ConnectionManager = ({
  children,
}: PropsWithChildren<any>): JSX.Element => {
  const { isActive, connector } = useWeb3React()
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

  const [isDelegateConnection, setIsDelegateConnection] = useState<boolean>(false)

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  useEffect(() => {
    if (triedEager && !isActive && router.query.redirectUrl)
      openWalletSelectorModal()
  }, [triedEager, isActive, router.query])

  const [isNetworkChangeInProgress, setNetworkChangeInProgress] = useState(false)
  const toast = useToast()
  const requestManualNetworkChange = (chain) => () =>
    toast({
      title: "Your wallet doesn't support switching chains automatically",
      description: `Please switch to ${RPC[chain].chainName} from your wallet manually!`,
      status: "info",
    })

  const requestNetworkChange = async (
    newChainId: number,
    callback?: () => void,
    errorHandler?: (err: unknown) => void
  ) => {
    if (connector instanceof WalletConnect || connector instanceof CoinbaseWallet)
      requestManualNetworkChange(Chains[newChainId])()
    else {
      setNetworkChangeInProgress(true)
      await requestNetworkChangeHandler(
        Chains[newChainId],
        callback,
        errorHandler
      )().finally(() => setNetworkChangeInProgress(false))
    }
  }

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
        requestNetworkChange,
        isDelegateConnection,
        setIsDelegateConnection,
        isNetworkChangeInProgress,
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

const useWeb3ConnectionManager = () => useContext(Web3Connection)

export { Web3ConnectionManager, useWeb3ConnectionManager }
