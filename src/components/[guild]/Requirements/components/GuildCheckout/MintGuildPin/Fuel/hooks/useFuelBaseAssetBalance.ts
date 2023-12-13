import { BaseAssetId } from "fuels"
import useFuel from "hooks/useFuel"
import useSWR from "swr"

const useFuelBaseAssetBalance = () => {
  const { wallet, address } = useFuel()

  const getBalance = async () => wallet.getBalance(BaseAssetId)

  return useSWR(!!wallet ? ["fuelBaseAssetBalance", address] : null, getBalance)
}

export default useFuelBaseAssetBalance
