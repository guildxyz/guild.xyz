/* eslint-disable @typescript-eslint/naming-convention */
import type { Provider } from "@fuel-ts/providers"
import type { WalletUnlocked } from "@fuel-ts/wallet"
import { atom, useAtom } from "jotai"
import { useEffect } from "react"

type FuelConnectorName = "Fuel Wallet" | "Fuelet Wallet"

const fuelConnectedAtom = atom(false)
const fuelConnectingAtom = atom(false)
const fuelAddress = atom("" as `0x${string}`)
const fuelWallet = atom(null as WalletUnlocked)
const fuelProvider = atom(null as Provider)

const useFuel = () => {
  const [isConnected, setIsConnected] = useAtom(fuelConnectedAtom)
  const [isConnecting, setIsConnecting] = useAtom(fuelConnectingAtom)
  const [address, setAddress] = useAtom(fuelAddress)
  const [wallet, setWallet] = useAtom(fuelWallet)
  const [provider, setProvider] = useAtom(fuelProvider)

  const onAccountChange = async (_newAccount: string) => {
    const Fuel = await import("fuels")

    const _address = Fuel.Address.fromString(_newAccount).toB256()
    const _provider = await windowFuel.getProvider()
    const _wallet = await windowFuel.getWallet(_address)

    setAddress(_address as `0x${string}`)
    setWallet(_wallet)
    setProvider(_provider)
  }

  const onConnectionChange = (_isConnected: boolean) => {
    setIsConnected(_isConnected)

    if (!_isConnected) {
      setAddress(null)
      setWallet(null)
      setProvider(null)
    }
  }

  const windowFuel = typeof window !== "undefined" && window.fuel

  useEffect(() => {
    if (!windowFuel) return
    setTimeout(() => {
      _checkConnection()
    }, 200)

    windowFuel.on("currentAccount", onAccountChange)
    windowFuel.on("connection", onConnectionChange)

    return () => {
      windowFuel.off("currentAccount", onAccountChange)
      windowFuel.off("connection", onConnectionChange)
    }
  }, [windowFuel])

  const _setupState = async () => {
    const [account] = await windowFuel.accounts()

    if (!account) return

    onAccountChange(account)

    setIsConnected(true)
  }

  const connect = async () => {
    if (!windowFuel) return

    try {
      setIsConnecting(true)
      await windowFuel.connect()
      _setupState()
    } catch (error) {
      console.error("[FUEL]: connectError: ", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const _checkConnection = async () => {
    if (!windowFuel) return

    const _isConnected = await windowFuel.isConnected()
    if (_isConnected) {
      try {
        _setupState()
      } catch (error) {
        console.error("[FUEL]: checkConnectionError: ", error)
      }
    }
  }

  const disconnect = async () => {
    if (!windowFuel) return
    try {
      await windowFuel.disconnect()
      setAddress("" as `0x${string}`)
      setIsConnected(false)
    } catch (error) {
      console.error("[FUEL]: disconnectError: ", error)
    }
  }

  const connectorName: FuelConnectorName | undefined = windowFuel?.connectorName

  return {
    windowFuel,
    isConnecting,
    isConnected,
    connect,
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
