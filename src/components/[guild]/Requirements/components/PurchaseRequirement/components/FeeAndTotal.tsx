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
import usePrice from "../hooks/usePrice"
import { usePurchaseRequirementContext } from "./PurchaseRequirementContex"

const FeeAndTotal = (): JSX.Element => {
  const { pickedCurrency, requirement } = usePurchaseRequirementContext()

  const textColor = useColorModeValue("gray.800", "gray.200")
  const textAccentColor = useColorModeValue("black", "white")

  const {
    data: { symbol },
  } = useTokenData(requirement.chain, pickedCurrency)

  const { data: priceData, isValidating } = usePrice(pickedCurrency)

  return (
    <Stack divider={<Divider />} color={textColor}>
      <HStack justifyContent="space-between">
        <HStack>
          <Text as="span">Fee</Text>
          <Tooltip
            label="1% Guild fee + estimated network fee"
            placement="top"
            hasArrow
          >
            <Icon as={Info} />
          </Tooltip>
        </HStack>
        <Text as="span">
          {pickedCurrency
            ? `${priceData?.totalFee?.toFixed(2)} ${symbol}`
            : "Choose currency"}
        </Text>
      </HStack>

      <HStack justifyContent="space-between">
        <Text as="span">Total</Text>

        <Text as="span">
          {pickedCurrency ? (
            <Skeleton isLoaded={!isValidating && !isNaN(priceData?.priceInUSD)}>
              {`$${priceData?.priceInUSD?.toFixed(2)} = `}
              <Text as="span" color={textAccentColor} fontWeight="semibold">
                {`${priceData?.price?.toFixed(2)} ${symbol}`}
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
