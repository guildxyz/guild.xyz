import { useWallet } from "@fuels/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { Contract } from "fuels"
import useSWRImmutable from "swr/immutable"
import { GuildActionInput, abi } from "../GuildPinContract"
import { FUEL_GUILD_PIN_CONTRACT_ID_0X } from "./constants"

const useAlreadyMinted = () => {
  const { id: userId } = useUser()
  const { id: guildId } = useGuild()
  const { wallet } = useWallet()

  const getAlreadyMinted = async () => {
    // Won't happen, just trying to make TS happy here
    if (!guildId) throw new Error("Invalid guild ID")
    if (!wallet) throw new Error("Couldn't find Fuel wallet")

    const contractInstance = new Contract(FUEL_GUILD_PIN_CONTRACT_ID_0X, abi, wallet)

    const { value } = await contractInstance.functions
      .pin_id_by_user_id(userId, guildId, GuildActionInput.Joined)
      .get()

    return value !== "None"
  }

  return useSWRImmutable(
    !!wallet ? ["alreadyMintedFuelGuildPin", userId, guildId, "Joined"] : null,
    getAlreadyMinted
  )
}

export default useAlreadyMinted
