import { useWallet } from "@fuels/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import useSWRImmutable from "swr/immutable"
import type { GuildActionInput } from "../GuildPinContractAbi"
import { GuildPinContractAbi__factory } from "../GuildPinContractAbi_factory"
import { FUEL_GUILD_PIN_CONTRACT_ID } from "./useMintFuelGuildPin"

const useAlreadyMinted = () => {
  const { id: userId } = useUser()
  const { id: guildId } = useGuild()
  const { wallet } = useWallet()

  const getAlreadyMinted = async () => {
    const contract = GuildPinContractAbi__factory.connect(
      FUEL_GUILD_PIN_CONTRACT_ID,
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      wallet
    )
    const { value } = await contract.functions
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      .pin_id_by_user_id(userId, guildId, "Joined" as GuildActionInput)
      .simulate()

    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    return value.gt(0)
  }

  return useSWRImmutable(
    !!wallet ? ["alreadyMintedFuelGuildPin", userId, guildId, "Joined"] : null,
    getAlreadyMinted
  )
}

export default useAlreadyMinted
