import { useDisclosure } from "@chakra-ui/react"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { useWeb3React } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import NetworkModal from "components/common/Layout/components/Account/components/NetworkModal/NetworkModal"
import requestNetworkChangeHandler from "components/common/Layout/components/Account/components/NetworkModal/utils/requestNetworkChange"
import { Chains, RPC } from "connectors"
import useContractWalletInfoToast from "hooks/useContractWalletInfoToast"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { PlatformName } from "types"
import PlatformMergeErrorModal from "./components/PlatformMergeErrorModal"
import WalletSelectorModal from "./components/WalletSelectorModal"
import useConnectFromLocalStorage from "./hooks/useConnectFromLocalStorage"
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
  showPlatformMergeModal: (
    _addressOrDomain: string,
    _platformName: PlatformName
  ) => {},
})

const Web3ConnectionManager = ({
  children,
}: PropsWithChildren<any>): JSX.Element => {
  const { isActive, connector } = useWeb3React()
  const router = useRouter()

  useContractWalletInfoToast()
  useConnectFromLocalStorage()

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
  const {
    isOpen: isPlatformMergeModalOpen,
    onOpen: openPlatformMergeModal,
    onClose: closePlatformMergeModal,
  } = useDisclosure()
  const [accountMergeAddress, setAccountMergeAddress] = useState<string>("")
  const [accountMergePlatformName, setAccountMergePlatformName] =
    useState<PlatformName>()

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

  const showPlatformMergeModal = (
    addressOrDomain: string,
    platformName: PlatformName
  ) => {
    setAccountMergeAddress(addressOrDomain)
    setAccountMergePlatformName(platformName)
    openPlatformMergeModal()
  }

  return (
    <Web3Connection.Provider
      value={{
        showPlatformMergeModal,
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
      <PlatformMergeErrorModal
        onClose={closePlatformMergeModal}
        isOpen={isPlatformMergeModalOpen}
        addressOrDomain={accountMergeAddress}
        platformName={accountMergePlatformName}
      />
    </Web3Connection.Provider>
  )
}

const useWeb3ConnectionManager = () => useContext(Web3Connection)

export { Web3ConnectionManager, useWeb3ConnectionManager }
