import useTokenData from "hooks/useTokenData"
import { ProvidedValueDisplayProps } from "requirements"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"

const TokenProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  const {
    data: { symbol },
  } = useTokenData(requirement?.chain, requirement?.address ?? NULL_ADDRESS)
  return `Number of ${symbol ?? "tokens"} held`
}

export default TokenProvidedValue
