/* eslint-disable @typescript-eslint/naming-convention */
import type { Provider } from "@fuel-ts/providers"
import type { WalletUnlocked } from "@fuel-ts/wallet"
import useFuel from "hooks/useFuel"
import { atom, useAtom } from "jotai"
import { useEffect } from "react"

export const fuelConnectedAtom = atom(false)
export const fuelConnectingAtom = atom(false)
export const fuelAddressAtom = atom("" as `0x${string}`)
export const fuelWalletAtom = atom(null as WalletUnlocked)
export const fuelProviderAtom = atom(null as Provider)

const FuelSetup = () => {
  const { windowFuel, checkConnection, onAccountChange } = useFuel()

  const [, setIsConnected] = useAtom(fuelConnectedAtom)
  const [, setAddress] = useAtom(fuelAddressAtom)
  const [, setWallet] = useAtom(fuelWalletAtom)
  const [, setProvider] = useAtom(fuelProviderAtom)

  useEffect(() => {
    if (!windowFuel) return

    const onConnectionChange = (_isConnected: boolean) => {
      setIsConnected(_isConnected)

      if (!_isConnected) {
        setAddress(null)
        setWallet(null)
        setProvider(null)
      }
    }

    setTimeout(async () => {
      console.log("checking...")
      await checkConnection()
    }, 200)

    windowFuel.on("currentAccount", onAccountChange)
    windowFuel.on("connection", onConnectionChange)

    return () => {
      windowFuel.off("currentAccount", onAccountChange)
      windowFuel.off("connection", onConnectionChange)
    }
  }, [])

  return null
}
export default FuelSetup
