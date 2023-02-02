import { parseUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Chains, RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import { TOKEN_BUYER_CONTRACT } from "utils/guildCheckout/constants"
import useAllowance from "../../hooks/useAllowance"
import usePrice from "../../hooks/usePrice"
import usePurchaseAsset from "../../hooks/usePurchaseAsset"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const PurchaseButton = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const { requirement, pickedCurrency } = useGuildCheckoutContext()

  const { data: priceData, isValidating: isPriceLoading } = usePrice()
  const { allowance, isAllowanceLoading, allowanceError } = useAllowance(
    pickedCurrency,
    TOKEN_BUYER_CONTRACT
  )

  const {
    data: { decimals },
    error,
  } = useTokenData(requirement?.chain, pickedCurrency)

  const priceInBigNumber =
    priceData && decimals
      ? parseUnits(priceData.price.toFixed(18), decimals)
      : undefined
  const isEnoughAllowance =
    priceInBigNumber && allowance
      ? parseUnits(priceData.price.toFixed(18), decimals).lte(allowance)
      : false

  const isDisabled =
    Chains[chainId] !== requirement.chain ||
    (pickedCurrency !== RPC[Chains[chainId]].nativeCurrency.symbol &&
      (isPriceLoading ||
        isAllowanceLoading ||
        allowanceError ||
        error ||
        !isEnoughAllowance))

  const { onSubmit, isLoading } = usePurchaseAsset()

  return (
    <CardMotionWrapper>
      <Button
        size="xl"
        isDisabled={isDisabled || isLoading}
        loadingText="Check your wallet"
        colorScheme={!isDisabled && "blue"}
        w="full"
        onClick={onSubmit}
      >
        Purchase
      </Button>
    </CardMotionWrapper>
  )
}

export default PurchaseButton
