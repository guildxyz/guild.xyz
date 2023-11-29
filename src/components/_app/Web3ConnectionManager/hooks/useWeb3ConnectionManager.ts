import { CHAIN_CONFIG, Chains } from "chains"
import useFuel from "hooks/useFuel"
import useToast from "hooks/useToast"
import { atom, useAtom } from "jotai"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { PlatformName, User } from "types"
import { useAccount, useDisconnect, useSwitchNetwork } from "wagmi"

const delegateConnectionAtom = atom(false)
const safeContextAtom = atom(false)
const walletSelectorModalAtom = atom(false)
const accountModalAtom = atom(false)
const platformMergeAlertAtom = atom(false)
const accountMergeAddressAtom = atom("")
const accountMergePlatformNameAtom = atom("" as PlatformName)

type Web3ConnectionManagerType = {
  accountMergeAddress?: string
  accountMergePlatformName?: PlatformName
  isPlatformMergeAlertOpen: boolean
  showPlatformMergeAlert: (
    addressOrDomain: string,
    platformName: PlatformName
  ) => void
  closePlatformMergeAlert: () => void

  isWalletSelectorModalOpen: boolean
  openWalletSelectorModal: () => void
  closeWalletSelectorModal: () => void
  isAccountModalOpen: boolean
  openAccountModal: () => void
  closeAccountModal: () => void
  requestNetworkChange: (
    chainId: number,
    callback?: () => void,
    errorHandler?: (err: any) => void
  ) => void
  isNetworkChangeInProgress: boolean

  isDelegateConnection: boolean
  setIsDelegateConnection: (newValue: boolean) => void
  isInSafeContext: boolean
  isWeb3Connected: boolean
  address?: `0x${string}`
  type?: User["addresses"][number]["walletType"]
  disconnect: () => void
}

const useWeb3ConnectionManager = (): Web3ConnectionManagerType => {
  const router = useRouter()

  const [isWalletSelectorModalOpen, setIsWalletSelectorModalOpen] = useAtom(
    walletSelectorModalAtom
  )
  const openWalletSelectorModal = () => setIsWalletSelectorModalOpen(true)
  const closeWalletSelectorModal = () => setIsWalletSelectorModalOpen(false)

  const [isAccountModalOpen, setIsAccountModalOpen] = useAtom(accountModalAtom)
  const openAccountModal = () => setIsAccountModalOpen(true)
  const closeAccountModal = () => setIsAccountModalOpen(false)

  const [isPlatformMergeAlertOpen, setIsPlatformMergeAlertOpen] = useAtom(
    platformMergeAlertAtom
  )
  const openPlatformMergeAlert = () => setIsPlatformMergeAlertOpen(true)
  const closePlatformMergeAlert = () => setIsPlatformMergeAlertOpen(false)

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

  const [accountMergeAddress, setAccountMergeAddress] = useAtom(
    accountMergeAddressAtom
  )
  const [accountMergePlatformName, setAccountMergePlatformName] = useAtom(
    accountMergePlatformNameAtom
  )

  const [isDelegateConnection, setIsDelegateConnection] = useAtom(
    delegateConnectionAtom
  )
  const [isInSafeContext, setIsInSafeContext] = useAtom(safeContextAtom)

  const {
    isConnected: isEvmConnected,
    connector: evmConnector,
    address: evmAddress,
  } = useAccount()

  useEffect(() => {
    if (!isEvmConnected || evmConnector?.id !== "safe") return
    setIsInSafeContext(true)
  }, [isEvmConnected, evmConnector])

  const { address: fuelAddress, isConnected: isFuelConnected } = useFuel()

  const isWeb3Connected = isEvmConnected || isFuelConnected
  const address = evmAddress || fuelAddress

  useEffect(() => {
    if (!isWeb3Connected && router.query.redirectUrl) openWalletSelectorModal()
  }, [isWeb3Connected, router.query])

  const type = isEvmConnected ? "EVM" : isFuelConnected ? "FUEL" : null

  const { disconnect: disconnectEvm } = useDisconnect()
  const { disconnect: disconnectFuel } = useFuel()

  const disconnect = () => {
    if (type === "EVM" && typeof disconnectEvm === "function") disconnectEvm()

    if (type === "FUEL" && typeof disconnectFuel === "function") disconnectFuel()
  }

  return {
    accountMergeAddress,
    accountMergePlatformName,
    isPlatformMergeAlertOpen,
    showPlatformMergeAlert,
    closePlatformMergeAlert,
    isWalletSelectorModalOpen,
    openWalletSelectorModal,
    closeWalletSelectorModal,
    isAccountModalOpen,
    openAccountModal,
    closeAccountModal,
    requestNetworkChange,
    isNetworkChangeInProgress,
    isDelegateConnection,
    setIsDelegateConnection,
    isInSafeContext,
    isWeb3Connected,
    address,
    type,
    disconnect,
  }
}

export default useWeb3ConnectionManager
