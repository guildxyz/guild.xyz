import { Box, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { Chains } from "connectors"
import useTokenData from "hooks/useTokenData"
import { useEffect } from "react"
import useVault from "requirements/Payment/hooks/useVault"
import { formatUnits } from "viem"
import { useRequirementContext } from "../../RequirementContext"
import { useGuildCheckoutContext } from "./GuildCheckoutContex"
import TokenInfo from "./PaymentCurrencyPicker/components/TokenInfo"

const PaymentFeeCurrency = (): JSX.Element => {
  const lightShade = useColorModeValue("white", "gray.700")
  const borderWidth = useColorModeValue(1, 0)

  const requirement = useRequirementContext()
  const { pickedCurrency, setPickedCurrency } = useGuildCheckoutContext()

  const { token, fee, error, isLoading } = useVault(
    requirement?.address,
    requirement?.data?.id,
    requirement?.chain
  )

  const {
    data: { decimals },
  } = useTokenData(requirement.chain, token)

  const convertedFee = fee && decimals ? formatUnits(fee, decimals) : undefined

  useEffect(() => {
    if (!token) return
    setPickedCurrency(token)
  }, [token])

  return (
    <Stack spacing={3}>
      <Text as="span" fontWeight="bold">
        Payment currency
      </Text>

      <Box
        w="full"
        h="auto"
        p={4}
        bgColor={lightShade}
        borderWidth={borderWidth}
        borderColor="gray.100"
        borderRadius="2xl"
      >
        <TokenInfo
          address={pickedCurrency}
          chainId={Chains[requirement?.chain]}
          requiredAmount={Number(convertedFee)}
          isLoading={isLoading}
          error={error}
        />
      </Box>
    </Stack>
  )
}

export default PaymentFeeCurrency
