import { MenuItem, useColorModeValue } from "@chakra-ui/react"
import { usePurchaseRequirementContext } from "../../PurchaseRequirementContex"
import TokenInfo from "./TokenInfo"

type Props = {
  chainId: number
  address?: string
}

const CurrencyListItem = ({ chainId, address }: Props): JSX.Element => {
  const { setPickedCurrency } = usePurchaseRequirementContext()

  const bgColor = useColorModeValue("gray.50", "blackAlpha.400")
  const hoverBgColor = useColorModeValue("gray.100", "blackAlpha.300")

  return (
    <MenuItem
      px={4}
      py={0}
      h={16}
      bgColor={bgColor}
      borderRadius={0}
      fontWeight="normal"
      textAlign="left"
      transition="background-color 0.1s ease"
      _hover={{ bgColor: hoverBgColor }}
      _focusVisible={{ bgColor: hoverBgColor }}
      onClick={() => setPickedCurrency(address)}
    >
      <TokenInfo chainId={chainId} address={address} />
    </MenuItem>
  )
}

export default CurrencyListItem
