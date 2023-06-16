import useSWRImmutable from "swr/immutable"
import { PURCHASABLE_REQUIREMENT_TYPES } from "utils/guildCheckout/constants"
import useGuild from "./useGuild"

const useNonPurchasableAssets = () => {
  const { roles } = useGuild()
  const requirements = roles?.flatMap((role) => role.requirements) ?? []

  const shouldFetch = requirements.some((req) =>
    PURCHASABLE_REQUIREMENT_TYPES.includes(req.type)
  )

  return useSWRImmutable<Record<number, string[]>>(
    shouldFetch ? "/api/nonPurchasableAssets" : null
  )
}

export default useNonPurchasableAssets
