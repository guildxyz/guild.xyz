import useGuild from "components/[guild]/hooks/useGuild"
import {
  getTokenBuyerContractData,
  TokenBuyerContractConfig,
} from "utils/guildCheckout/constants"
import useShouldABTest from "./useShouldABTest"

const useTokenBuyerContractData = (): TokenBuyerContractConfig => {
  const shouldABTest = useShouldABTest()
  const { id } = useGuild()

  return getTokenBuyerContractData(id, shouldABTest)
}

export default useTokenBuyerContractData
