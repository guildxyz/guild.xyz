import { useWallet } from "@fuel-wallet/react"
import useSWRImmutable from "swr/immutable"
import { GuildPinContractAbi__factory } from "../GuildPinContractAbi_factory"
import { FUEL_GUILD_PIN_CONTRACT_ID } from "./useMintFuelGuildPin"

const useFuelGuildPinFee = () => {
  const { wallet } = useWallet()

  const getFee = async () => {
    const contract = GuildPinContractAbi__factory.connect(
      FUEL_GUILD_PIN_CONTRACT_ID,
      wallet
    )
    const { value } = await contract.functions.fee().simulate()

    return value
  }

  return useSWRImmutable(!!wallet ? "fuelGuildPinFee" : null, getFee)
}

export default useFuelGuildPinFee
