import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import useFuel from "hooks/useFuel"
import useSWRImmutable from "swr/immutable"
import type { GuildActionInput } from "../GuildPinContractAbi"
import { GuildPinContractAbi__factory } from "../GuildPinContractAbi_factory"
import { FUEL_GUILD_PIN_CONTRACT_ID } from "./useMintFuelGuildPin"

const useAlreadyMinted = () => {
  const { id: userId } = useUser()
  const { id: guildId } = useGuild()
  const { wallet } = useFuel()

  const getFee = async () => {
    const contract = GuildPinContractAbi__factory.connect(
      FUEL_GUILD_PIN_CONTRACT_ID,
      wallet
    )
    const { value } = await contract.functions
      .pin_id_by_user_id(userId, guildId, "Joined" as GuildActionInput)
      .simulate()

    return value.gt(0)
  }

  return useSWRImmutable(
    !!wallet ? ["alreadyMintedFuelGuildPin", userId, guildId, "Joined"] : null,
    getFee
  )
}

export default useAlreadyMinted
