import {
  useAccount as useFuelAccount,
  useDisconnect as useFuelDisconnect,
  useIsConnected,
  useWallet,
} from "@fuel-wallet/react"
import parseFuelAddress from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPin/Fuel/parseFuelAddress"
import { atom, useAtom, useSetAtom } from "jotai"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { User } from "types"
import { useAccount, useDisconnect, useSignMessage } from "wagmi"
import { walletSelectorModalAtom } from "../components/WalletSelectorModal"

const safeContextAtom = atom(false)

type Web3ConnectionManagerType = {
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
  }, [isEvmConnected, evmConnector, setIsInSafeContext])

  const { account: fuelAccount } = useFuelAccount()
  const fuelAddress = parseFuelAddress(fuelAccount)
  const { isConnected: isFuelConnected } = useIsConnected()

  const isWeb3Connected = isEvmConnected || isFuelConnected
  const address = evmAddress || fuelAddress

  useEffect(() => {
    if (!isWeb3Connected && router.query.redirectUrl)
      setIsWalletSelectorModalOpen(true)
  }, [isWeb3Connected, router.query, setIsWalletSelectorModalOpen])

  const type = isEvmConnected ? "EVM" : isFuelConnected ? "FUEL" : null

  const { disconnect: disconnectEvm } = useDisconnect()
  const { disconnect: disconnectFuel } = useFuelDisconnect()

  const { wallet: fuelWallet } = useWallet()

  const disconnect = () => {
    if (type === "EVM" && typeof disconnectEvm === "function") disconnectEvm()

    if (type === "FUEL" && typeof disconnectFuel === "function") disconnectFuel()
  }

  const signMessage = (message: string) => {
    if (type === "EVM") {
      return signMessageAsync({ account: evmAddress, message })
    }
    return fuelWallet.signMessage(message)
  }

  return {
    isInSafeContext,
    isWeb3Connected,
    address: address,
    type,
    disconnect,
    signMessage,
  }
}

export default useWeb3ConnectionManager
