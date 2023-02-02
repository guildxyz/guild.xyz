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
import useTokenData from "hooks/useTokenData"
import { Info } from "phosphor-react"
import {
  GUILD_FEE_FIXED_USD,
  GUILD_FEE_PERCENTAGE,
} from "utils/guildCheckout/constants"
import usePrice from "../hooks/usePrice"
import { useGuildCheckoutContext } from "./GuildCheckoutContex"

const FeeAndTotal = (): JSX.Element => {
  const { pickedCurrency, requirement } = useGuildCheckoutContext()

  const textColor = useColorModeValue("gray.800", "gray.200")
  const textAccentColor = useColorModeValue("black", "white")

  const {
    data: { symbol },
  } = useTokenData(requirement.chain, pickedCurrency)

  const { data: priceData, isValidating } = usePrice(pickedCurrency)

  const isTooSmallFee = priceData
    ? parseFloat((priceData.gasFee + priceData.guildFee).toFixed(3)) <= 0.0 ?? ""
    : undefined
  const isTooSmallPrice = priceData
    ? parseFloat(priceData.price.toFixed(3)) <= 0.0 ?? ""
    : undefined

  return (
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
                  : ((priceData?.gasFee ?? 0) + (priceData?.guildFee ?? 0))?.toFixed(
                      3
                    )
              } ${symbol}`
            : "Choose currency"}
        </Text>
      </HStack>

      <HStack justifyContent="space-between">
        <Text as="span">Total</Text>

        <Text as="span">
          {pickedCurrency ? (
            <Skeleton isLoaded={!isValidating && !isNaN(priceData?.priceInUSD)}>
              {priceData
                ? `$${(
                    priceData.priceInUSD +
                    priceData.gasFeeInUSD +
                    priceData.guildFeeInUSD
                  )?.toFixed(2)} = `
                : "0.00"}
              <Text as="span" color={textAccentColor} fontWeight="semibold">
                {priceData
                  ? `${
                      isTooSmallPrice
                        ? "< 0.001"
                        : (
                            priceData.price +
                            priceData.gasFee +
                            priceData.guildFee
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
  )
}

export default FeeAndTotal
