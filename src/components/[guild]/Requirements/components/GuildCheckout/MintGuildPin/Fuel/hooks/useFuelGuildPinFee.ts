import { useWallet } from "@fuels/react"
import useSWRImmutable from "swr/immutable"
import { GuildPinContractAbi__factory } from "../GuildPinContractAbi_factory"
import { FUEL_GUILD_PIN_CONTRACT_ID_0X } from "./constants"

const useFuelGuildPinFee = () => {
  const { wallet } = useWallet()

  const getFee = async () => {
    if (!wallet) throw new Error("Couldn't find Fuel wallet")

    const contract = GuildPinContractAbi__factory.connect(
      FUEL_GUILD_PIN_CONTRACT_ID_0X,
      wallet
    )
    const { value } = await contract.functions.fee().get()

    return value
  }

  return useSWRImmutable(!!wallet ? "fuelGuildPinFee" : null, getFee)
}

export default useFuelGuildPinFee
