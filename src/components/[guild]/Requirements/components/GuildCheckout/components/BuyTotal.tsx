import { HStack, Skeleton, Td, Text, Tr } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import useVault from "requirements/Payment/hooks/useVault"
import usePayFee from "../hooks/usePayFee"
import FeesTable from "./FeesTable"
import { useGuildCheckoutContext } from "./GuildCheckoutContex"
import PriceFallback from "./PriceFallback"

const BuyTotal = (): JSX.Element => {
  const { requirement, pickedCurrency } = useGuildCheckoutContext()
  const {
    data: { token, fee },
    isValidating,
    error,
  } = useVault(requirement.address, requirement.data.id, requirement.chain)

  const {
    data: { decimals, symbol },
  } = useTokenData(requirement.chain, token)

  const priceInSellToken = fee && decimals ? Number(formatUnits(fee, decimals)) : 0

  const { estimatedGasFee, estimateGasError, isEstimateGasLoading } = usePayFee()

  const isTooSmallPrice = priceInSellToken < 0.001

  return (
    <FeesTable
      buttonComponent={
        <HStack>
          <Text as="span" colorScheme="gray">
            Total:
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
      }
    >
      <Tr>
        <Td>Price</Td>
        <Td color="WindowText">
          {priceInSellToken
            ? `${isTooSmallPrice ? "< 0.001" : Number(priceInSellToken.toFixed(3))} `
            : "0.00 "}
          {symbol}
        </Td>
      </Tr>
      <Tr>
        <Td>Gas fee</Td>
        <Td>
          <Skeleton isLoaded={!isEstimateGasLoading}>
            {estimateGasError || !estimatedGasFee
              ? "Couldn't estimate"
              : `${parseFloat(
                  formatUnits(
                    estimatedGasFee,
                    RPC[requirement.chain].nativeCurrency.decimals
                  )
                ).toFixed(8)} ${RPC[requirement.chain].nativeCurrency.symbol}`}
          </Skeleton>
        </Td>
      </Tr>
    </FeesTable>
  )
}

export default BuyTotal
