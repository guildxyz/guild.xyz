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
import usePayFee from "../hooks/usePayFee"
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

  const nativeCurrency = RPC[requirement.chain].nativeCurrency
  const { estimatedGasFee } = usePayFee()

  const estimatedGasInFloat = estimatedGasFee
    ? parseFloat(formatUnits(estimatedGasFee, nativeCurrency.decimals))
    : undefined

  const isNativeCurrency = pickedCurrency === nativeCurrency.symbol
  const calculatedGasFee = isNativeCurrency ? estimatedGasInFloat : 0

  const isTooSmallPrice = priceInSellToken < 0.001
  const isTooSmallFee = guildFeeInSellToken < 0.001

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
