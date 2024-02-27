import { CHAIN_CONFIG, Chains } from "chains"
import useFuel from "hooks/useFuel"
import useToast from "hooks/useToast"
import { atom, useAtom, useSetAtom } from "jotai"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { User } from "types"
import { useAccount, useDisconnect, useSignMessage, useSwitchNetwork } from "wagmi"
import { walletSelectorModalAtom } from "../components/WalletSelectorModal"

const safeContextAtom = atom(false)

type Web3ConnectionManagerType = {
  requestNetworkChange: (
    chainId: number,
    callback?: () => void,
    errorHandler?: (err: any) => void
  ) => void
  isNetworkChangeInProgress: boolean

  isInSafeContext: boolean
  isWeb3Connected: boolean
  address?: `0x${string}`
  type?: User["addresses"][number]["walletType"]
  disconnect: () => void
  signMessage: (message: string) => Promise<string>
}

const useWeb3ConnectionManager = (): Web3ConnectionManagerType => {
  const router = useRouter()

  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

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

  const [isInSafeContext, setIsInSafeContext] = useAtom(safeContextAtom)

  const {
    isConnected: isEvmConnected,
    connector: evmConnector,
    address: evmAddress,
  } = useAccount()
  const { signMessageAsync } = useSignMessage()

  useEffect(() => {
    if (!isEvmConnected || evmConnector?.id !== "safe") return
    setIsInSafeContext(true)
  }, [isEvmConnected, evmConnector])

  const { address: fuelAddress, isConnected: isFuelConnected } = useFuel()

  const isWeb3Connected = isEvmConnected || isFuelConnected
  const address = evmAddress || fuelAddress

  useEffect(() => {
    if (!isWeb3Connected && router.query.redirectUrl)
      setIsWalletSelectorModalOpen(true)
  }, [isWeb3Connected, router.query])

  const type = isEvmConnected ? "EVM" : isFuelConnected ? "FUEL" : null

  const { disconnect: disconnectEvm } = useDisconnect()
  const { disconnect: disconnectFuel, wallet } = useFuel()

  const disconnect = () => {
    if (type === "EVM" && typeof disconnectEvm === "function") disconnectEvm()

    if (type === "FUEL" && typeof disconnectFuel === "function") disconnectFuel()
  }

  const signMessage = (message: string) => {
    if (type === "EVM") {
      return signMessageAsync({ message })
    }
    return wallet.signMessage(message)
  }

  return {
    requestNetworkChange,
    isNetworkChangeInProgress,
    isInSafeContext,
    isWeb3Connected,
    address,
    type,
    disconnect,
    signMessage,
  }
}

export default useWeb3ConnectionManager
