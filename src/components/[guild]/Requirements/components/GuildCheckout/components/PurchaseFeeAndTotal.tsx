import {
  Divider,
  HStack,
  Icon,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import { Info, Question } from "phosphor-react"
import { GUILD_FEE_PERCENTAGE } from "utils/guildCheckout/constants"
import usePrice from "../hooks/usePrice"
import usePurchaseAsset from "../hooks/usePurchaseAsset"
import { useGuildCheckoutContext } from "./GuildCheckoutContex"
import PriceFallback from "./PriceFallback"

const PurchaseFeeAndTotal = (): JSX.Element => {
  const { pickedCurrency, requirement } = useGuildCheckoutContext()

  const {
    data: { symbol },
  } = useTokenData(requirement.chain, pickedCurrency)

  const {
    data: {
      guildBaseFeeInSellToken,
      guildFeeInSellToken,
      estimatedPriceInSellToken,
      estimatedPriceInUSD,
      guildFeeInUSD,
      priceInSellToken,
    },
    isValidating,
    error,
  } = usePrice(pickedCurrency)

  const {
    estimatedGasFee,
    estimatedGasFeeInUSD,
    estimateGasError,
    isLoading: isEstimateGasLoading,
  } = usePurchaseAsset()

  const nativeCurrency = RPC[requirement.chain].nativeCurrency
  const estimatedGasInFloat = estimatedGasFee
    ? parseFloat(formatUnits(estimatedGasFee, nativeCurrency.decimals))
    : undefined

  const isNativeCurrency = pickedCurrency === nativeCurrency.symbol
  const calculatedGasFee = isNativeCurrency ? estimatedGasInFloat ?? 0 : 0

  const isTooSmallFee = parseFloat(guildFeeInSellToken?.toFixed(3)) < 0.001
  const isTooSmallPrice = parseFloat(estimatedPriceInSellToken?.toFixed(3)) < 0.001

  return (
    <Stack spacing={3}>
      <Stack divider={<Divider />}>
        <HStack justifyContent="space-between">
          <HStack>
            <Text as="span" colorScheme="gray">
              Fee
            </Text>
            <Tooltip
              label={`${GUILD_FEE_PERCENTAGE * 100}%${
                guildBaseFeeInSellToken
                  ? ` + ${guildBaseFeeInSellToken} ${symbol}`
                  : ""
              } Guild fee + protocol fee + estimated network fee`}
              placement="top"
              hasArrow
            >
              <Icon as={Info} color="gray" />
            </Tooltip>
          </HStack>
          <Skeleton
            isLoaded={Boolean(
              error ||
                estimateGasError ||
                (pickedCurrency && !isEstimateGasLoading && guildFeeInSellToken)
            )}
          >
            <Text as="span" colorScheme="gray">
              {error || (!estimatedGasFee && !guildFeeInSellToken) ? (
                "Couldn't calculate"
              ) : pickedCurrency ? (
                <>
                  {isTooSmallFee
                    ? "< 0.001"
                    : (
                        (calculatedGasFee ?? 0) + (guildFeeInSellToken ?? 0)
                      )?.toFixed(3)}{" "}
                  {symbol}
                </>
              ) : (
                "Choose currency"
              )}
            </Text>
          </Skeleton>
        </HStack>

        <HStack justifyContent="space-between">
          <Text as="span" colorScheme="gray">
            Total
          </Text>

          <PriceFallback {...{ error, pickedCurrency }}>
            <Text as="span">
              <Skeleton isLoaded={!isValidating}>
                <Text as="span" colorScheme="gray">
                  {estimatedPriceInUSD
                    ? `$${(
                        estimatedPriceInUSD +
                        guildFeeInUSD +
                        (estimatedGasFeeInUSD ?? 0)
                      )?.toFixed(2)}`
                    : "$0.00"}
                  {" = "}
                </Text>
                <Text as="span" fontWeight="semibold">
                  {estimatedPriceInSellToken && guildFeeInSellToken
                    ? `${
                        isTooSmallPrice
                          ? "< 0.001"
                          : (
                              estimatedPriceInSellToken +
                              guildFeeInSellToken +
                              calculatedGasFee
                            )?.toFixed(3)
                      } `
                    : "0.00 "}
                  {symbol}
                </Text>
              </Skeleton>
            </Text>
          </PriceFallback>
        </HStack>
      </Stack>

      {priceInSellToken && guildFeeInSellToken && !isTooSmallPrice && (
        <HStack justifyContent="end" spacing={1}>
          <Text as="span" colorScheme="gray" fontSize="sm">
            {`Max: ${(
              priceInSellToken +
              guildFeeInSellToken +
              (calculatedGasFee ?? 0)
            )?.toFixed(3)} ${symbol}`}
          </Text>

          <Tooltip
            placement="top"
            hasArrow
            label="You will pay no more than this, including slippage"
          >
            <Icon as={Question} boxSize={4} color="gray" />
          </Tooltip>
        </HStack>
      )}

      {estimatedGasFee && !isNativeCurrency && (
        // We're displaying gas fee here when the user picked an ERC20 as sellToken
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

export default PurchaseFeeAndTotal
