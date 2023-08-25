import useAccess from "components/[guild]/hooks/useAccess"
import useNonPurchasableAssets from "components/[guild]/hooks/useNonPurchasableAssets"
import { Chains } from "connectors"
import dynamic from "next/dynamic"
import {
  PURCHASABLE_REQUIREMENT_TYPES,
  purchaseSupportedChains,
} from "utils/guildCheckout/constants"
import { useGuildCheckoutContext } from "./components/GuildCheckoutContex"

const DynamicallyLoadedPurchaseRequirement = dynamic(
  () => import("./PurchaseRequirement"),
  {
    ssr: false,
  }
)

const DynamicPurchaseRequirement = () => {
  const { data } = useNonPurchasableAssets()

  const { requirement, isOpen, isInfoModalOpen } = useGuildCheckoutContext()

  const {
    data: { requirementAccesses },
    isLoading: isAccessLoading,
  } = useAccess(requirement?.roleId)
  const satisfiesRequirement = requirementAccesses?.find(
    (req) => req.requirementId === requirement.id
  )?.access

  const shouldNotRenderComponent =
    !isOpen &&
    !isInfoModalOpen &&
    ((!requirementAccesses && isAccessLoading) ||
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
