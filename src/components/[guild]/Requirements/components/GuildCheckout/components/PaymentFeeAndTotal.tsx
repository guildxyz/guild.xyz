import { HStack, Skeleton, Stack, Text } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import useVault from "requirements/Payment/hooks/useVault"
import usePayFee from "../hooks/usePayFee"
import { useGuildCheckoutContext } from "./GuildCheckoutContex"
import PriceFallback from "./PriceFallback"

const PaymentFeeAndTotal = (): JSX.Element => {
  const { requirement, pickedCurrency } = useGuildCheckoutContext()
  const { data, isValidating, error } = useVault(
    requirement.data.id,
    requirement.chain
  )

  const {
    data: { decimals, symbol },
  } = useTokenData(requirement.chain, data?.token)

  const priceInSellToken =
    data && decimals ? Number(formatUnits(data.fee, decimals)) : 0

  const nativeCurrency = RPC[requirement.chain].nativeCurrency
  const { estimatedGasFee } = usePayFee()

  const isNativeCurrency = pickedCurrency === nativeCurrency.symbol

  const isTooSmallPrice = priceInSellToken < 0.001

  return (
    <Stack>
      <HStack justifyContent="space-between">
        <Text as="span" colorScheme="gray">
          Total
        </Text>

        <PriceFallback {...{ error, pickedCurrency }}>
          <Text as="span">
            <Skeleton isLoaded={!isValidating}>
              <Text as="span" fontWeight="semibold">
                {priceInSellToken
                  ? `${
                      isTooSmallPrice
                        ? "< 0.001"
                        : Number(priceInSellToken.toFixed(3))
                    } `
                  : "0.00 "}
                {symbol}
              </Text>
            </Skeleton>
          </Text>
        </PriceFallback>
      </HStack>

      {estimatedGasFee && !isNativeCurrency && (
        // We're displaying gas fee here when the fee should be paid in an ERC20 token
        <Text as="span" colorScheme="gray" fontSize="sm">
          {`Estimated gas fee: ${parseFloat(
            formatUnits(
              estimatedGasFee,
              RPC[requirement.chain].nativeCurrency.decimals
            )
          ).toFixed(8)} ${RPC[requirement.chain].nativeCurrency.symbol}`}
        </Text>
      )}
    </Stack>
  )
}

export default PaymentFeeAndTotal
