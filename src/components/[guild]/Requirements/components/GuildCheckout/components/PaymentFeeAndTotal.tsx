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
import useVault from "requirements/Payment/hooks/useVault"
import { useGuildCheckoutContext } from "./GuildCheckoutContex"
import PriceFallback from "./PriceFallback"

const PaymentFeeAndTotal = (): JSX.Element => {
  const { requirement, pickedCurrency } = useGuildCheckoutContext()
  const { data, isValidating, error } = useVault(
    requirement.data.id,
    requirement.chain
  )

  const guildSharePercentage = (data?.guildShareBps ?? 0) / 100

  const {
    data: { decimals, symbol },
  } = useTokenData(requirement.chain, data?.token)

  const priceInSellToken =
    data && decimals ? Number(formatUnits(data.fee, decimals)) : 0
  const guildFeeInSellToken =
    priceInSellToken && guildSharePercentage
      ? priceInSellToken * (guildSharePercentage / 100)
      : 0

  // TODO
  const estimatedGasFee = 10000

  const isTooSmallPrice = priceInSellToken < 0.001
  const isTooSmallFee = guildFeeInSellToken < 0.001

  const nativeCurrency = RPC[requirement.chain].nativeCurrency
  const calculatedGasFee = estimatedGasFee
    ? parseFloat(formatUnits(estimatedGasFee, nativeCurrency.decimals))
    : 0

  return (
    <Stack divider={<Divider />}>
      <HStack justifyContent="space-between">
        <HStack>
          <Text as="span" colorScheme="gray">
            Fee
          </Text>
          <Tooltip
            label={`${guildSharePercentage}% Guild fee + estimated network fee`}
            placement="top"
            hasArrow
          >
            <Icon as={Info} color="gray" />
          </Tooltip>
        </HStack>
        <Text as="span" colorScheme="gray">
          {error ? (
            "Couldn't calculate"
          ) : pickedCurrency ? (
            <>
              {isTooSmallFee
                ? "< 0.001"
                : (calculatedGasFee + guildFeeInSellToken)?.toFixed(3)}{" "}
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

        <PriceFallback {...{ error, pickedCurrency }}>
          <Text as="span">
            <Skeleton isLoaded={!isValidating}>
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
          </Text>
        </PriceFallback>
      </HStack>
    </Stack>
  )
}

export default PaymentFeeAndTotal
