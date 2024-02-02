import { Chains } from "chains"
import useNonPurchasableAssets from "components/[guild]/hooks/useNonPurchasableAssets"
import { useRoleMembership } from "components/explorer/hooks/useMemberships"
import dynamic from "next/dynamic"
import {
  PURCHASABLE_REQUIREMENT_TYPES,
  purchaseSupportedChains,
} from "utils/guildCheckout/constants"
import { useRequirementContext } from "../RequirementContext"
import { useGuildCheckoutContext } from "./components/GuildCheckoutContex"
import { useTransactionStatusContext } from "./components/TransactionStatusContext"

const DynamicallyLoadedPurchaseRequirement = dynamic(
  () => import("./PurchaseRequirement"),
  {
    ssr: false,
  }
)

const DynamicPurchaseRequirement = () => {
  const { data } = useNonPurchasableAssets()

  const requirement = useRequirementContext()
  const { isOpen } = useGuildCheckoutContext()
  const { isTxModalOpen } = useTransactionStatusContext()

  const { roleMembership, isValidating: isAccessValidating } = useRoleMembership(
    requirement?.roleId
  )
  const satisfiesRequirement = roleMembership?.requirements?.find(
    (req) => req.requirementId === requirement.id
  )?.access

  const shouldNotRenderComponent =
    !isOpen &&
    !isTxModalOpen &&
    ((!roleMembership && isAccessValidating) ||
      satisfiesRequirement ||
      !PURCHASABLE_REQUIREMENT_TYPES.includes(requirement.type) ||
      !purchaseSupportedChains[requirement.type]?.includes(requirement.chain))

  if (
    !data ||
    data[Chains[requirement.chain]]?.includes(requirement.address?.toLowerCase()) ||
    shouldNotRenderComponent
  )
    return null

  return <DynamicallyLoadedPurchaseRequirement />
}

export default DynamicPurchaseRequirement
