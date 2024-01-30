/* eslint-disable @typescript-eslint/naming-convention */
import {
  fuelAddressAtom,
  fuelConnectedAtom,
  fuelConnectingAtom,
  fuelConnectorsAtom,
  fuelProviderAtom,
  fuelWalletAtom,
} from "hooks/useSetupFuel"
import { useAtom } from "jotai"

export type FuelConnectorName = "Fuel Wallet" | "Fuelet Wallet"

export const FUEL_ADDRESS_REGEX = /^0x[a-f0-9]{64}$/i

const useFuel = () => {
  const [connectors] = useAtom(fuelConnectorsAtom)
  const [isConnected, setIsConnected] = useAtom(fuelConnectedAtom)
  const [isConnecting, setIsConnecting] = useAtom(fuelConnectingAtom)
  const [address, setAddress] = useAtom(fuelAddressAtom)
  const [wallet, setWallet] = useAtom(fuelWalletAtom)
  const [provider, setProvider] = useAtom(fuelProviderAtom)

  const onAccountChange = async (_newAccount: string) => {
    const Fuel = await import("fuels")

    const _address = Fuel.Address.fromString(_newAccount).toB256()

    const _provider = await windowFuel.getProvider()
    const _wallet = await windowFuel.getWallet(_address)

    setAddress(_address as `0x${string}`)
    setWallet(_wallet)
    setProvider(_provider)
  }

  const windowFuel = typeof window !== "undefined" && (window.fuel ?? window.fuelet)

  const _setupState = async () => {
    const [account] = await windowFuel.accounts()

    if (!account) return

    await onAccountChange(account)
    setIsConnected(true)
  }

  const connect = async (options?: { connector: FuelConnectorName }) => {
    if (!windowFuel) return

    try {
      setIsConnecting(true)

      if (options?.connector) {
        await windowFuel.selectConnector(options.connector)
      }

      await windowFuel.connect()
      await _setupState()
    } catch (error) {
      console.error("[FUEL]: connectError: ", error)
    } finally {
      setIsConnecting(false)
    }
  }

  // Used for autoConnect behaviour, but we don't need that for now
  // const checkConnection = async () => {
  //   if (!windowFuel) return

  //   const _isConnected = await windowFuel.isConnected()
  //   if (_isConnected) {
  //     try {
  //       _setupState()
  //     } catch (error) {
  //       console.error("[FUEL]: checkConnectionError: ", error)
  //     }
  //   }
  // }

  const disconnect = async () => {
    if (!windowFuel) return
    try {
      await windowFuel.disconnect()
    } catch (error) {
      console.error("[FUEL]: disconnectError: ", error)
    } finally {
      setAddress("" as `0x${string}`)
      setIsConnected(false)
    }
  }

  const connectorName: FuelConnectorName | undefined = windowFuel?.connectorName

  return {
    windowFuel,
    connectors,
    isConnecting,
    isConnected,
    onAccountChange,
    connect,
    // checkConnection,
    disconnect,
    connectorName,
    address,
    wallet,
    provider,
  }
}

declare global {
  interface Window {
    fuel: any
    fuelet: any
  }
}

export default useFuel
