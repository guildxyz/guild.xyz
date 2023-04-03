import useGuild from "components/[guild]/hooks/useGuild"
import {
  getTokenBuyerContractData,
  TokenBuyerContractConfig,
} from "utils/guildCheckout/constants"

const useTokenBuyerContractData = (): TokenBuyerContractConfig => {
  const { id } = useGuild()

  return getTokenBuyerContractData(id)
}

export default useTokenBuyerContractData
