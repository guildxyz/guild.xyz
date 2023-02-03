import {
  Divider,
  HStack,
  Icon,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
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

  const textColor = useColorModeValue("gray.800", "gray.200")
  const textAccentColor = useColorModeValue("black", "white")

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

  const isTooSmallFee = parseFloat(guildFeeInSellToken?.toFixed(3)) <= 0.0
  const isTooSmallPrice = parseFloat(priceInSellToken?.toFixed(3)) < 0.001

  return (
    <Stack spacing={3}>
      <Stack divider={<Divider />} color={textColor}>
        <HStack justifyContent="space-between">
          <HStack>
            <Text as="span">Fee</Text>
            <Tooltip
              label={`${
                GUILD_FEE_PERCENTAGE * 100
              }% + $${GUILD_FEE_FIXED_USD} Guild fee + protocol fee + estimated network fee`}
              placement="top"
              hasArrow
            >
              <Icon as={Info} />
            </Tooltip>
          </HStack>
          <Text as="span">
            {pickedCurrency ? (
              <>
                {isTooSmallFee
                  ? "< 0.001"
                  : // TODO: display the gas fee separately when the user pays with ERC20 tokens
                    (
                      (pickedCurrency === nativeCurrency.symbol
                        ? estimatedGasInFloat ?? 0
                        : 0) + guildFeeInSellToken ?? 0
                    )?.toFixed(3)}{" "}
                {symbol}
              </>
            ) : (
              "Choose currency"
            )}
          </Text>
        </HStack>

        <HStack justifyContent="space-between">
          <Text as="span">Total</Text>

          <Text as="span">
            {pickedCurrency ? (
              <Skeleton isLoaded={!isValidating}>
                <Text as="span">
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
                <Text as="span" color={textAccentColor} fontWeight="semibold">
                  {priceInSellToken && guildFeeInSellToken
                    ? `${
                        isTooSmallPrice
                          ? "< 0.001"
                          : (
                              priceInSellToken +
                              guildFeeInSellToken +
                              (pickedCurrency === nativeCurrency.symbol
                                ? estimatedGasInFloat ?? 0
                                : 0)
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

      {estimateGasError && (
        <Text as="span" colorScheme="gray" fontSize="sm">
          Couldn't estimate gas
        </Text>
      )}
    </Stack>
  )
}

export default FeeAndTotal
