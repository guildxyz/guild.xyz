import { HStack, Icon, Skeleton, Td, Text, Tooltip, Tr } from "@chakra-ui/react"
import { Info, Question } from "@phosphor-icons/react"
import useTokenData from "hooks/useTokenData"
import { GUILD_FEE_PERCENTAGE, NULL_ADDRESS } from "utils/guildCheckout/constants"
import { formatUnits } from "viem"
import { CHAIN_CONFIG, Chain } from "wagmiConfig/chains"
import { useRequirementContext } from "../../RequirementContext"
import usePrice from "../hooks/usePrice"
import usePurchaseAsset from "../hooks/usePurchaseAsset"
import FeesTable from "./FeesTable"
import { useGuildCheckoutContext } from "./GuildCheckoutContext"
import PriceFallback from "./PriceFallback"

const PurchaseFeeAndTotal = (): JSX.Element => {
  const requirement = useRequirementContext()
  const { pickedCurrency } = useGuildCheckoutContext()

  // TODO: we could remove the cast once we'll have schemas for "ERC..." requirements
  const requirementChain = requirement.chain as Chain

  const {
    data: { symbol },
  } = useTokenData(requirementChain, pickedCurrency)

  const {
    data: {
      guildBaseFeeInSellToken,
      estimatedGuildFeeInSellToken,
      estimatedGuildFeeInUSD,
      maxGuildFeeInSellToken,
      estimatedPriceInSellToken,
      estimatedPriceInUSD,
      maxPriceInSellToken,
    },
    isValidating,
    error,
  } = usePrice(pickedCurrency)

  const { estimatedGas, estimatedGasInUSD, isPreparing } = usePurchaseAsset()

  const estimatedGasInFloat = estimatedGas
    ? parseFloat(
        formatUnits(
          estimatedGas,
          CHAIN_CONFIG[requirementChain].nativeCurrency.decimals
        )
      )
    : null

  const isNativeCurrency = pickedCurrency === NULL_ADDRESS

  // 1% + base fee on the estimated price
  const guildFee = Number((estimatedGuildFeeInSellToken ?? 0)?.toFixed(3))

  const estimatedPriceSum = Number(
    (
      (estimatedPriceInSellToken ?? 0) +
      (estimatedGuildFeeInSellToken ?? 0) +
      (isNativeCurrency ? (estimatedGasInFloat ?? 0) : 0)
    )?.toFixed(3)
  )
  const maxPriceSum = Number(
    (
      (maxPriceInSellToken ?? 0) +
      (maxGuildFeeInSellToken ?? 0) +
      (isNativeCurrency ? (estimatedGasInFloat ?? 0) : 0)
    )?.toFixed(3)
  )

  return (
    <FeesTable
      buttonComponent={
        <HStack justifyContent={"space-between"} w="full">
          <Text as="span" colorScheme="gray">
            Total with fees:
          </Text>

          <PriceFallback {...{ error, pickedCurrency }}>
            <Text as="span">
              <Skeleton isLoaded={!isValidating}>
                <Text as="span" colorScheme="gray">
                  {estimatedPriceInUSD && estimatedGuildFeeInUSD
                    ? `$${(
                        estimatedPriceInUSD +
                          estimatedGuildFeeInUSD +
                          (estimatedGasInUSD ?? 0)
                      )?.toFixed(2)}`
                    : "$0.00"}
                  {" = "}
                </Text>
                <Text as="span" fontWeight="semibold">
                  {estimatedPriceSum
                    ? `${
                        estimatedPriceSum < 0.001
                          ? "< 0.001 "
                          : `${estimatedPriceSum} `
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
        <Td>
          <HStack>
            <Text as="span">Max price</Text>

            <Tooltip
              placement="top"
              hasArrow
              label="You will pay no more than this, including slippage"
            >
              <Icon as={Question} boxSize={4} color="gray" />
            </Tooltip>
          </HStack>
        </Td>
        <Td isNumeric color="var(--chakra-colors-chakra-body-text)">
          <Skeleton isLoaded={!isValidating}>
            <Text as="span">{`${maxPriceSum} ${symbol}`}</Text>
          </Skeleton>
        </Td>
      </Tr>

      <Tr>
        <Td>Expected price</Td>

        <Td isNumeric>
          <Skeleton isLoaded={!isValidating}>
            <Text as="span">{`${estimatedPriceSum} ${symbol}`}</Text>
          </Skeleton>
        </Td>
      </Tr>

      <Tr>
        <Td>
          <HStack>
            <Text as="span">Guild fee</Text>
            <Tooltip
              label={`${GUILD_FEE_PERCENTAGE * 100}% of the token's price${
                guildBaseFeeInSellToken
                  ? ` + ${guildBaseFeeInSellToken} ${symbol}`
                  : ""
              }`}
              placement="top"
              hasArrow
            >
              <Icon as={Info} />
            </Tooltip>
          </HStack>
        </Td>
        <Td isNumeric>
          {guildFee < 0.001 ? "< 0.001 " : `${guildFee} `}
          {symbol}
        </Td>
      </Tr>

      <Tr>
        <Td>Gas fee</Td>
        <Td isNumeric>
          <Skeleton isLoaded={!isPreparing}>
            <Text as="span">
              {!estimatedGasInFloat
                ? "Couldn't estimate"
                : `${estimatedGasInFloat.toFixed(8)} ${
                    CHAIN_CONFIG[requirementChain].nativeCurrency.symbol
                  }`}
            </Text>
          </Skeleton>
        </Td>
      </Tr>
    </FeesTable>
  )
}

export default PurchaseFeeAndTotal
