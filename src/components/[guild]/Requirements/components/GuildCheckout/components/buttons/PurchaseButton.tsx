import { BigNumber } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Chains, RPC } from "connectors"
import { TOKEN_BUYER_CONTRACT } from "utils/guildCheckout/constants"
import useAllowance from "../../hooks/useAllowance"
import usePrice from "../../hooks/usePrice"
import usePurchaseAsset from "../../hooks/usePurchaseAsset"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const PurchaseButton = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const { requirement, pickedCurrency, agreeWithTOS } = useGuildCheckoutContext()

  const {
    data: { priceInWei },
    isValidating: isPriceLoading,
  } = usePrice()
  const { allowance, isAllowanceLoading, allowanceError } = useAllowance(
    pickedCurrency,
    TOKEN_BUYER_CONTRACT
  )

  const isEnoughAllowance =
    priceInWei && allowance ? BigNumber.from(priceInWei).lte(allowance) : false

  const isDisabled =
    !agreeWithTOS ||
    Chains[chainId] !== requirement.chain ||
    (pickedCurrency !== RPC[Chains[chainId]].nativeCurrency.symbol &&
      (isPriceLoading || isAllowanceLoading || allowanceError || !isEnoughAllowance))

  const { onSubmit, isLoading } = usePurchaseAsset()

  return (
    <CardMotionWrapper>
      <Button
        size="xl"
        isDisabled={isDisabled || isLoading}
        loadingText="Check your wallet"
        colorScheme={!isDisabled ? "blue" : "gray"}
        w="full"
        onClick={onSubmit}
        data-dd-action-name="PurchaseButton (GuildCheckout)"
      >
        Purchase
      </Button>
    </CardMotionWrapper>
  )
}

export default PurchaseButton
