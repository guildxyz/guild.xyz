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

  // TODO: add gas fee
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
            {pickedCurrency
              ? `${
                  isTooSmallFee
                    ? "< 0.001"
                    : // TODO: gas fee
                      /* (priceData?.gasFee ?? 0) + */ (
                        guildFeeInSellToken ?? 0
                      )?.toFixed(3)
                } ${symbol}`
              : "Choose currency"}
          </Text>
        </HStack>

        <HStack justifyContent="space-between">
          <Text as="span">Total</Text>

          <Text as="span">
            {pickedCurrency ? (
              <Skeleton isLoaded={!isValidating}>
                {priceInUSD
                  ? `$${(
                      priceInUSD +
                      // TODO: gas fee
                      /* priceData.gasFeeInUSD + */
                      guildFeeInUSD
                    )?.toFixed(2)} = `
                  : "0.00"}
                <Text as="span" color={textAccentColor} fontWeight="semibold">
                  {priceInSellToken && guildFeeInSellToken
                    ? `${
                        isTooSmallPrice
                          ? "< 0.001"
                          : (
                              priceInSellToken +
                              // TODO: gas fee
                              /*priceData.gasFee + */
                              guildFeeInSellToken
                            )?.toFixed(3)
                      } ${symbol}`
                    : "0.00"}
                </Text>
              </Skeleton>
            ) : (
              "Choose currency"
            )}
          </Text>
        </HStack>
      </Stack>

      {(estimatedGas || estimateGasError) && (
        <Text as="span" colorScheme="gray" fontSize="sm">
          {estimateGasError
            ? "Couldn't estimate gas"
            : `Estimated gas fee: ${parseFloat(
                formatUnits(
                  estimatedGas,
                  RPC[requirement.chain].nativeCurrency.decimals
                )
              ).toFixed(8)} ${RPC[requirement.chain].nativeCurrency.symbol}`}
        </Text>
      )}
    </Stack>
  )
}

export default FeeAndTotal
