import {
  Collapse,
  HStack,
  Icon,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import Button from "components/common/Button"
import { RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import { CaretDown, Info, Question } from "phosphor-react"
import { GUILD_FEE_PERCENTAGE } from "utils/guildCheckout/constants"
import usePrice from "../hooks/usePrice"
import usePurchaseAsset from "../hooks/usePurchaseAsset"
import { useGuildCheckoutContext } from "./GuildCheckoutContex"
import PriceFallback from "./PriceFallback"

const PurchaseFeeAndTotal = (): JSX.Element => {
  const { isOpen, onToggle } = useDisclosure()

  const { pickedCurrency, requirement } = useGuildCheckoutContext()

  const {
    data: { symbol },
  } = useTokenData(requirement.chain, pickedCurrency)

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

  const {
    estimatedGasFee,
    estimateGasError,
    isLoading: isEstimateGasLoading,
  } = usePurchaseAsset()

  // 1% + base fee on the estimated price
  const guildFee = Number((estimatedGuildFeeInSellToken ?? 0)?.toFixed(3))
  const estimatedPriceSum = Number(
    (
      (estimatedPriceInSellToken ?? 0) + (estimatedGuildFeeInSellToken ?? 0)
    )?.toFixed(3)
  )
  const maxPriceSum = Number(
    ((maxPriceInSellToken ?? 0) + (maxGuildFeeInSellToken ?? 0))?.toFixed(3)
  )

  return (
    <Stack spacing={0}>
      <Button
        display="flex"
        justifyContent="start"
        fontWeight="normal"
        p={0}
        h="auto"
        maxW="max-content"
        variant="unstyled"
        onClick={onToggle}
        rightIcon={
          <Icon
            as={CaretDown}
            boxSize={3}
            transition="transform 0.2s ease"
            transform={`rotate(${isOpen ? "-180" : "0"}deg)`}
          />
        }
      >
        <HStack>
          <Text as="span" colorScheme="gray">
            Total:
          </Text>

          <PriceFallback {...{ error, pickedCurrency }}>
            <Text as="span">
              <Skeleton isLoaded={!isValidating}>
                <Text as="span" colorScheme="gray">
                  {estimatedPriceInUSD && estimatedGuildFeeInUSD
                    ? `$${(estimatedPriceInUSD + estimatedGuildFeeInUSD)?.toFixed(
                        2
                      )}`
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
              </Skeleton>
            </Text>
          </PriceFallback>
        </HStack>
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <TableContainer borderWidth={1} borderRadius="xl" mt={2}>
          <Table variant="simple" size="sm" color="gray">
            <Tbody>
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
                <Td color="WindowText">
                  <Skeleton isLoaded={!isValidating}>
                    <Text as="span">{`${maxPriceSum} ${symbol}`}</Text>
                  </Skeleton>
                </Td>
              </Tr>

              <Tr>
                <Td>Expected price</Td>

                <Td>
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
                <Td>
                  {guildFee < 0.001 ? "< 0.001 " : `${guildFee} `}
                  {symbol}
                </Td>
              </Tr>

              <Tr>
                <Td>Gas fee</Td>
                <Td>
                  <Skeleton isLoaded={!isEstimateGasLoading}>
                    <Text as="span">
                      {error || estimateGasError || !estimatedGasFee
                        ? "Couldn't calculate"
                        : `${parseFloat(
                            formatUnits(
                              estimatedGasFee,
                              RPC[requirement.chain].nativeCurrency.decimals
                            )
                          ).toFixed(8)} ${
                            RPC[requirement.chain].nativeCurrency.symbol
                          }`}
                    </Text>
                  </Skeleton>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Collapse>
    </Stack>
  )
}

export default PurchaseFeeAndTotal
