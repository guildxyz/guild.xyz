import {
  useAccount as useFuelAccount,
  useDisconnect as useFuelDisconnect,
  useIsConnected,
  useWallet,
} from "@fuel-wallet/react"
import parseFuelAddress from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPin/Fuel/parseFuelAddress"
import { useSetAtom } from "jotai"
import { useRouter } from "next/router"
import { PropsWithChildren, createContext, useEffect, useState } from "react"
import { User } from "types"
import { useAccount, useDisconnect, useSignMessage } from "wagmi"
import { walletSelectorModalAtom } from "./components/WalletSelectorModal"

const Web3ConnectionManagerContext = createContext<{
  isInSafeContext: boolean
  isWeb3Connected: boolean
  address?: `0x${string}`
  type?: User["addresses"][number]["walletType"]
  disconnect: () => void
  signMessage: (message: string) => Promise<string>
}>(undefined)

const Web3ConnectionManager = ({ children }: PropsWithChildren<unknown>) => {
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  // TODO: we should make this work! Maybe we should just call it elsewhere
  // useConnectFromLocalStorage()

  const router = useRouter()

  const [isInSafeContext, setIsInSafeContext] = useState(false)

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

  const { account: fuelAccount } = useFuelAccount()
  const fuelAddress = parseFuelAddress(fuelAccount)
  const { isConnected: isFuelConnected } = useIsConnected()

  const isWeb3Connected = isEvmConnected || isFuelConnected
  const address = evmAddress || fuelAddress

  useEffect(() => {
    if (!isWeb3Connected && router.query.redirectUrl)
      setIsWalletSelectorModalOpen(true)
  }, [isWeb3Connected, router.query])

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

  return (
    <Web3ConnectionManagerContext.Provider
      value={{
        isInSafeContext,
        isWeb3Connected,
        address,
        type,
        disconnect,
        signMessage,
      }}
    >
      {children}
    </Web3ConnectionManagerContext.Provider>
  )
}

export default Web3ConnectionManager
export { Web3ConnectionManagerContext }
