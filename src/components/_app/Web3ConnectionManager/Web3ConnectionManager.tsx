import { useDisclosure } from "@chakra-ui/react"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { useWeb3React } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import AccountModal from "components/common/Layout/components/Account/components/AccountModal"
import NetworkModal from "components/common/Layout/components/Account/components/NetworkModal/NetworkModal"
import requestNetworkChangeHandler from "components/common/Layout/components/Account/components/NetworkModal/utils/requestNetworkChange"
import useUser from "components/[guild]/hooks/useUser"
import { useConnect } from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { Message } from "components/[guild]/JoinModal/hooks/useOauthPopupWindow"
import { Chains, RPC } from "connectors"
import useKeyPair from "hooks/useKeyPair"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import platforms from "platforms/platforms"
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"
import useDatadog from "../Datadog/useDatadog"
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
  const { keyPair, isValid } = useKeyPair()
  const { addDatadogError } = useDatadog()
  const toast = useToast()
  const { onSubmit } = useConnect(() => {
    toast({ status: "success", title: "Success", description: "Platform connected" })
  })
  const { platformUsers } = useUser()

  useEffect(() => {
    if (!keyPair || !isValid || !platformUsers) return

    Object.keys(platforms).forEach((platformName) => {
      const storageKey = `${platformName}_shouldConnect`
      const strData = window.localStorage.getItem(storageKey)
      window.localStorage.removeItem(storageKey)

      const isAlreadyConnected = platformUsers.some(
        (platformUser) => platformUser.platformName === platformName
      )
      if (isAlreadyConnected) return

      if (strData) {
        const data: Message = JSON.parse(strData)

        if (data.type === "OAUTH_SUCCESS") {
          onSubmit({ platformName, authData: data.data })
        } else {
          toast({
            status: "error",
            title: data.data.error ?? "Error",
            description:
              data.data.errorDescription || `Failed to connect ${platformName}`,
          })
          addDatadogError("OAuth error from localStorage data", data.data)
        }
      }
    })
  }, [keyPair, isValid, platformUsers])

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
