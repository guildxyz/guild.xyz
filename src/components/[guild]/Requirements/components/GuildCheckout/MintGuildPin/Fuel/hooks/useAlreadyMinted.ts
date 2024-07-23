import { useWallet } from "@fuels/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import useSWRImmutable from "swr/immutable"
import type { GuildActionInput } from "../GuildPinContractAbi"
import { GuildPinContractAbi__factory } from "../GuildPinContractAbi_factory"
import { FUEL_GUILD_PIN_CONTRACT_ID_0X } from "./constants"

const useAlreadyMinted = () => {
  const { id: userId } = useUser()
  const { id: guildId } = useGuild()
  const { wallet } = useWallet()

  const getAlreadyMinted = async () => {
    // Won't happen, just trying to make TS happy here
    if (!guildId) throw new Error("Invalid guild ID")
    if (!wallet) throw new Error("Couldn't find Fuel wallet")

    const contract = GuildPinContractAbi__factory.connect(
      FUEL_GUILD_PIN_CONTRACT_ID_0X,
      wallet
    )
    const { value } = await contract.functions
      .pin_id_by_user_id(userId, guildId, "Joined" as GuildActionInput)
      .simulate()

    return value?.gt(0)
  }

  return useSWRImmutable(
    !!wallet ? ["alreadyMintedFuelGuildPin", userId, guildId, "Joined"] : null,
    getAlreadyMinted
  )
}

export default useAlreadyMinted
