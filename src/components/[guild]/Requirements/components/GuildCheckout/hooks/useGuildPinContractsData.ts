import useGuild from "components/[guild]/hooks/useGuild"
import { getGuildPinContracts } from "utils/guildCheckout/constants"

const useGuildPinContractsData = () => {
  const { id } = useGuild()
  return getGuildPinContracts(id)
}

export default useGuildPinContractsData
