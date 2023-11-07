import { atom, useAtom } from "jotai"
import { useEffect } from "react"

const fuelConnectedAtom = atom(false)
const fuelConnectingAtom = atom(false)
const fuelAddress = atom("")

const useFuel = () => {
  const [isConnected, setIsConnected] = useAtom(fuelConnectedAtom)
  const [isConnecting, setIsConnecting] = useAtom(fuelConnectingAtom)
  const [address, setAddress] = useAtom(fuelAddress)

  const windowFuel = typeof window !== "undefined" && !!window.fuel

  useEffect(() => {
    if (!windowFuel) return
    setTimeout(() => {
      checkConnection()
    }, 200)
  }, [windowFuel])

  const connect = async () => {
    if (!windowFuel) return

    try {
      setIsConnecting(true)

      const Fuel = await import("fuels")

      await window.fuel.connect()
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const [account] = await window.fuel.accounts()
      const fuelAccount = Fuel.Address.fromString(account)
      setAddress(fuelAccount.toB256())
      setIsConnected(true)
    } catch (error) {
      console.error("[FUEL]: connectError: ", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const checkConnection = async () => {
    if (!windowFuel) return

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _isConnected = await window.fuel.isConnected()
    if (_isConnected) {
      try {
        const [account] = await window.fuel.accounts()

        if (!account) return

        const Fuel = await import("fuels")

        const fuelAccount = Fuel.Address.fromString(account)
        setAddress(fuelAccount.toB256())
        setIsConnected(true)
      } catch (error) {
        console.error("[FUEL]: checkConnectionError: ", error)
      }
    }
  }

  const disconnect = async () => {
    if (!windowFuel) return
    try {
      await window.fuel.disconnect()
      setAddress("")
      setIsConnected(false)
    } catch (error) {
      console.error("[FUEL]: disconnectError: ", error)
    }
  }

  // console.log("[FUEL DEBUG]:", {
  //   windowFuel,
  //   isConnecting,
  //   isConnected,
  //   address,
  //   connect,
  // disconnect,
  // })

  const connectorName = windowFuel ? window.fuel.connectorName : undefined

  // TODO: event listeners

  return {
    windowFuel,
    isConnecting,
    isConnected,
    connectorName,
    address,
    connect,
    disconnect,
  }
}

declare global {
  interface Window {
    fuel: any
  }
}

export default useFuel
