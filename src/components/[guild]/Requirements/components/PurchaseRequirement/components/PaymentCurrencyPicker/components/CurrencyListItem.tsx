import Button from "components/common/Button"
import { usePurchaseRequirementContext } from "../../PurchaseRequirementContex"
import TokenInfo from "./TokenInfo"

type Props = {
  chainId: number
  address?: string
  onPick: () => void
}

const CurrencyListItem = ({ chainId, address, onPick }: Props): JSX.Element => {
  const { setPickedCurrency } = usePurchaseRequirementContext()

  return (
    <Button
      variant="unstyled"
      p={4}
      py={0}
      h={16}
      borderRadius={0}
      fontWeight="normal"
      textAlign="left"
      _hover={{ bgColor: "blackAlpha.300" }}
      _focusVisible={{ outline: "none", bgColor: "blackAlpha.300" }}
      onClick={() => {
        setPickedCurrency(address)
        onPick()
      }}
    >
      <TokenInfo chainId={chainId} address={address} />
    </Button>
  )
}

export default CurrencyListItem
