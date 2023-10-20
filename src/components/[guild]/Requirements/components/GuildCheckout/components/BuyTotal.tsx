import { HStack, Skeleton, Td, Text, Tr } from "@chakra-ui/react"
import { CHAIN_CONFIG } from "connectors"
import useTokenData from "hooks/useTokenData"
import useVault from "requirements/Payment/hooks/useVault"
import { formatUnits } from "viem"
import { useRequirementContext } from "../../RequirementContext"
import usePayFee from "../hooks/usePayFee"
import FeesTable from "./FeesTable"
import { useGuildCheckoutContext } from "./GuildCheckoutContex"
import PriceFallback from "./PriceFallback"

const BuyTotal = (): JSX.Element => {
  const requirement = useRequirementContext()
  const { pickedCurrency } = useGuildCheckoutContext()

  const { token, fee, isLoading, error } = useVault(
    requirement.address,
    requirement.data.id,
    requirement.chain
  )

  const {
    data: { decimals, symbol },
  } = useTokenData(requirement.chain, token)

  const isNativeCurrency =
    pickedCurrency === CHAIN_CONFIG[requirement.chain].nativeCurrency.symbol

  const { estimatedGasFee, estimateGasError, isEstimateGasLoading } = usePayFee()
  const estimatedGasInFloat = estimatedGasFee
    ? parseFloat(
        formatUnits(
          estimatedGasFee,
          CHAIN_CONFIG[requirement.chain].nativeCurrency.decimals
        )
      )
    : null

  const priceInSellToken =
    fee && decimals
      ? Number(formatUnits(fee, decimals)) +
        (isNativeCurrency ? estimatedGasInFloat ?? 0 : 0)
      : 0

  const isTooSmallPrice = priceInSellToken < 0.001

  return (
    <FeesTable
      buttonComponent={
        <HStack justifyContent={"space-between"} w="full">
          <Text as="span" colorScheme="gray">
            Total with fees:
          </Text>

          <PriceFallback {...{ error, pickedCurrency }}>
            <Text as="span">
              <Skeleton isLoaded={!isLoading}>
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
                {!isNativeCurrency && (
                  <Text as="span" colorScheme="gray">
                    {` + Gas`}
                  </Text>
                )}
              </Skeleton>
            </Text>
          </PriceFallback>
        </HStack>
      }
    >
      <Tr>
        <Td>Price</Td>
        <Td isNumeric color="WindowText">
          {priceInSellToken
            ? `${isTooSmallPrice ? "< 0.001" : Number(priceInSellToken.toFixed(3))} `
            : "0.00 "}
          {symbol}
        </Td>
      </Tr>
      <Tr>
        <Td>Gas fee</Td>
        <Td isNumeric>
          <Skeleton isLoaded={!isEstimateGasLoading}>
            {estimateGasError || !estimatedGasFee
              ? "Couldn't estimate"
              : `${parseFloat(
                  formatUnits(
                    estimatedGasFee,
                    CHAIN_CONFIG[requirement.chain].nativeCurrency.decimals
                  )
                ).toFixed(8)} ${
                  CHAIN_CONFIG[requirement.chain].nativeCurrency.symbol
                }`}
          </Skeleton>
        </Td>
      </Tr>
    </FeesTable>
  )
}

export default BuyTotal
