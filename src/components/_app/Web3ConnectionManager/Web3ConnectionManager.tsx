import { useDisclosure } from "@chakra-ui/react"
import { CHAIN_CONFIG, Chains } from "chains"
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
import { useAccount, useSwitchNetwork } from "wagmi"
import PlatformMergeErrorAlert from "./components/PlatformMergeErrorAlert"
import WalletSelectorModal from "./components/WalletSelectorModal"
import useConnectFromLocalStorage from "./hooks/useConnectFromLocalStorage"
import useEagerConnect from "./hooks/useEagerConnect"
import useNewSharedSocialsToast from "./hooks/useNewSharedSocialsToast"

const Web3Connection = createContext({
  triedEager: false,
  isWalletSelectorModalOpen: false,
  openWalletSelectorModal: () => {},
  closeWalletSelectorModal: () => {},
  isAccountModalOpen: false,
  openAccountModal: () => {},
  closeAccountModal: () => {},
  requestNetworkChange: (
    _chainId: number,
    _callback?: () => void,
    _errorHandler?: (err) => void
  ) => {},
  isDelegateConnection: false,
  setIsDelegateConnection: (_: boolean) => {},
  isNetworkChangeInProgress: false,
  showPlatformMergeAlert: (
    _addressOrDomain: string,
    _platformName: PlatformName
  ) => {},
})

const Web3ConnectionManager = ({
  children,
}: PropsWithChildren<any>): JSX.Element => {
  const { isConnected, connector } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (!connector || !isConnected) return
    window.localStorage.setItem("connector", connector.name)
  }, [connector, isConnected])

  const {
    isOpen: isWalletSelectorModalOpen,
    onOpen: openWalletSelectorModal,
    onClose: closeWalletSelectorModal,
  } = useDisclosure()
  const {
    isOpen: isAccountModalOpen,
    onOpen: openAccountModal,
    onClose: closeAccountModal,
  } = useDisclosure()
  const {
    isOpen: isPlatformMergeAlertOpen,
    onOpen: openPlatformMergeAlert,
    onClose: closePlatformMergeAlert,
  } = useDisclosure()
  const [accountMergeAddress, setAccountMergeAddress] = useState<string>("")
  const [accountMergePlatformName, setAccountMergePlatformName] =
    useState<PlatformName>()

  useContractWalletInfoToast()
  useConnectFromLocalStorage()
  useNewSharedSocialsToast(openAccountModal)

  const [isDelegateConnection, setIsDelegateConnection] = useState<boolean>(false)

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  useEffect(() => {
    if (triedEager && !isConnected && router.query.redirectUrl)
      openWalletSelectorModal()
  }, [triedEager, isConnected, router.query])

  const { switchNetworkAsync, isLoading: isNetworkChangeInProgress } =
    useSwitchNetwork()

  const toast = useToast()

  const requestNetworkChange = async (
    newChainId: number,
    callback?: () => void,
    errorHandler?: (err: unknown) => void
  ) => {
    if (!switchNetworkAsync) {
      toast({
        title: "Your wallet doesn't support switching chains automatically",
        description: `Please switch to ${
          CHAIN_CONFIG[Chains[newChainId]].name
        } from your wallet manually!`,
        status: "info",
      })
    } else {
      switchNetworkAsync(newChainId)
        .then(() => callback?.())
        .catch(errorHandler)
    }
  }

  const showPlatformMergeAlert = (
    addressOrDomain: string,
    platformName: PlatformName
  ) => {
    setAccountMergeAddress(addressOrDomain)
    setAccountMergePlatformName(platformName)
    openPlatformMergeAlert()
  }

  return (
    <Web3Connection.Provider
      value={{
        showPlatformMergeAlert,
        isWalletSelectorModalOpen,
        openWalletSelectorModal,
        closeWalletSelectorModal,
        triedEager,
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
      <PlatformMergeErrorAlert
        onClose={closePlatformMergeAlert}
        isOpen={isPlatformMergeAlertOpen}
        addressOrDomain={accountMergeAddress}
        platformName={accountMergePlatformName}
      />
    </Web3Connection.Provider>
  )
}

const useWeb3ConnectionManager = () => useContext(Web3Connection)

export { Web3ConnectionManager, useWeb3ConnectionManager }
