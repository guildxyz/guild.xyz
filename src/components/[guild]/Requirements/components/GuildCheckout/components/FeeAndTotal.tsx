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
import { Info } from "phosphor-react"
import {
  GUILD_FEE_FIXED_USD,
  GUILD_FEE_PERCENTAGE,
} from "utils/guildCheckout/constants"
import usePrice from "../hooks/usePrice"
import usePurchaseAsset from "../hooks/usePurchaseAsset"
import { useGuildCheckoutContext } from "./GuildCheckoutContex"

const FeeAndTotal = (): JSX.Element => {
  const { pickedCurrency, requirement } = useGuildCheckoutContext()

  const {
    data: { symbol },
  } = useTokenData(requirement.chain, pickedCurrency)

  const {
    data: { guildFeeInSellToken, priceInSellToken, priceInUSD, guildFeeInUSD },
    isValidating,
  } = usePrice(pickedCurrency)

  const { estimatedGas, estimateGasError } = usePurchaseAsset()

  const nativeCurrency = RPC[requirement.chain].nativeCurrency
  const estimatedGasInFloat = estimatedGas
    ? parseFloat(formatUnits(estimatedGas, nativeCurrency.decimals))
    : undefined

  const isNativeCurrency = pickedCurrency === nativeCurrency.symbol
  const calculatedGasFee = isNativeCurrency ? estimatedGasInFloat ?? 0 : 0

  const isTooSmallFee = parseFloat(guildFeeInSellToken?.toFixed(3)) <= 0.0
  const isTooSmallPrice = parseFloat(priceInSellToken?.toFixed(3)) < 0.001

  return (
    <Stack spacing={3}>
      <Stack divider={<Divider />}>
        <HStack justifyContent="space-between">
          <HStack>
            <Text as="span" colorScheme="gray">
              Fee
            </Text>
            <Tooltip
              label={`${
                GUILD_FEE_PERCENTAGE * 100
              }% + $${GUILD_FEE_FIXED_USD} Guild fee + protocol fee + estimated network fee`}
              placement="top"
              hasArrow
            >
              <Icon as={Info} color="gray" />
            </Tooltip>
          </HStack>
          <Text as="span" colorScheme="gray">
            {pickedCurrency ? (
              <>
                {isTooSmallFee
                  ? "< 0.001"
                  : // TODO: display the gas fee separately when the user pays with ERC20 tokens
                    (calculatedGasFee + guildFeeInSellToken ?? 0)?.toFixed(3)}{" "}
                {symbol}
              </>
            ) : (
              "Choose currency"
            )}
          </Text>
        </HStack>

        <HStack justifyContent="space-between">
          <Text as="span" colorScheme="gray">
            Total
          </Text>

          <Text as="span">
            {pickedCurrency ? (
              <Skeleton isLoaded={!isValidating}>
                <Text as="span" colorScheme="gray">
                  {priceInUSD
                    ? `$${(
                        priceInUSD +
                        // TODO: gas fee
                        /* priceData.gasFeeInUSD + */
                        guildFeeInUSD
                      )?.toFixed(2)}`
                    : "$0.00"}
                  {" = "}
                </Text>
                <Text as="span" fontWeight="semibold">
                  {priceInSellToken && guildFeeInSellToken
                    ? `${
                        isTooSmallPrice
                          ? "< 0.001"
                          : (
                              priceInSellToken +
                              guildFeeInSellToken +
                              calculatedGasFee
                            )?.toFixed(3)
                      } `
                    : "0.00 "}
                  {symbol}
                </Text>
              </Skeleton>
            ) : (
              "Choose currency"
            )}
          </Text>
        </HStack>
      </Stack>

      {estimatedGas && isNativeCurrency && (
        // We're displaying gas fee here when the user picked an ERC20 as sellToken
        <Text as="span" colorScheme="gray" fontSize="sm">
          {`Estimated gas fee: ${parseFloat(
            formatUnits(estimatedGas, RPC[requirement.chain].nativeCurrency.decimals)
          ).toFixed(8)} ${RPC[requirement.chain].nativeCurrency.symbol}`}
        </Text>
      )}

      {estimateGasError && (
        <Text as="span" colorScheme="gray" fontSize="sm">
          Couldn't estimate gas
        </Text>
      )}
    </Stack>
  )
}

export default FeeAndTotal
