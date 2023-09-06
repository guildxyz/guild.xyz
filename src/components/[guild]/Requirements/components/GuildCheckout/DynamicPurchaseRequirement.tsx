import useAccess from "components/[guild]/hooks/useAccess"
import useNonPurchasableAssets from "components/[guild]/hooks/useNonPurchasableAssets"
import { Chains } from "connectors"
import dynamic from "next/dynamic"
import {
  PURCHASABLE_REQUIREMENT_TYPES,
  purchaseSupportedChains,
} from "utils/guildCheckout/constants"
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

  const { requirement, isOpen } = useGuildCheckoutContext()
  const { isTxModalOpen } = useTransactionStatusContext()

  const { data: accessData, isValidating: isAccessValidating } = useAccess(
    requirement?.roleId
  )
  const satisfiesRequirement = accessData?.requirements?.find(
    (req) => req.requirementId === requirement.id
  )?.access

  const shouldNotRenderComponent =
    !isOpen &&
    !isTxModalOpen &&
    ((!accessData && isAccessValidating) ||
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
