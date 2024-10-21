import { useWallet } from "@fuels/react"
import { Contract } from "fuels"
import useSWRImmutable from "swr/immutable"
import { abi } from "../GuildPinContract"
import { FUEL_GUILD_PIN_CONTRACT_ID_0X } from "./constants"

const useFuelGuildPinFee = () => {
  const { wallet } = useWallet()

  const getFee = async () => {
    if (!wallet) throw new Error("Couldn't find Fuel wallet")

    const contract = new Contract(FUEL_GUILD_PIN_CONTRACT_ID_0X, abi, wallet)
    const { value } = await contract.functions.fee().get()

    return value
  }

  return useSWRImmutable(!!wallet ? "fuelGuildPinFee" : null, getFee)
}

export default useFuelGuildPinFee
