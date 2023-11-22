import type { Provider, WalletUnlocked } from "fuels"
import { atom, useAtom } from "jotai"
import { useEffect } from "react"
import useFuel from "./useFuel"

export const fuelConnectedAtom = atom(false)
export const fuelConnectingAtom = atom(false)
export const fuelAddressAtom = atom("" as `0x${string}`)
export const fuelWalletAtom = atom(null as WalletUnlocked)
export const fuelProviderAtom = atom(null as Provider)

const useSetupFuel = () => {
  const { windowFuel, onAccountChange } = useFuel()

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

    // autoConnect - we don't need this for now
    // setTimeout(async () => {
    //   await checkConnection()
    // }, 200)

    windowFuel.on("currentAccount", onAccountChange)
    windowFuel.on("connection", onConnectionChange)

    return () => {
      windowFuel.off("currentAccount", onAccountChange)
      windowFuel.off("connection", onConnectionChange)
    }
  }, [])
}

export default useSetupFuel
