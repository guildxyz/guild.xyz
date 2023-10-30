import { Box, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { Chains } from "chains"
import { useEffect } from "react"
import useVault from "requirements/Payment/hooks/useVault"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { formatUnits } from "viem"
import { useToken } from "wagmi"
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

  const { data: tokenData } = useToken({
    address: token,
    chainId: Chains[requirement.chain],
    enabled: Boolean(token !== NULL_ADDRESS && Chains[requirement.chain]),
  })

  const convertedFee =
    fee && tokenData?.decimals ? formatUnits(fee, tokenData.decimals) : undefined

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
