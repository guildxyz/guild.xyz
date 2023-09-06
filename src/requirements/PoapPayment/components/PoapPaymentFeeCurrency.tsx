import { Box, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import { useGuildCheckoutContext } from "components/[guild]/Requirements/components/GuildCheckout/components/GuildCheckoutContex"
import TokenInfo from "components/[guild]/Requirements/components/GuildCheckout/components/PaymentCurrencyPicker/components/TokenInfo"
import { Chains, RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import { useEffect } from "react"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"

/**
 * This is copy-pasted from BuyPass and adjusted to work with legacy POAP logic. We
 * will switch to general payment requirement once POAP is a reward
 */
const PoapPaymentFeeCurrency = (): JSX.Element => {
  const lightShade = useColorModeValue("white", "gray.700")
  const borderWidth = useColorModeValue(1, 0)

  const { requirement, pickedCurrency, setPickedCurrency } =
    useGuildCheckoutContext()

  const { vaultData, isVaultLoading: isValidating } = usePoapVault(
    requirement?.data?.id,
    Chains[requirement?.chain]
  )
  const { token, fee } = vaultData

  const {
    data: { decimals },
  } = useTokenData(requirement.chain, token)

  const convertedFee = fee && decimals ? formatUnits(fee, decimals) : undefined

  useEffect(() => {
    if (!token) return
    setPickedCurrency(
      token === NULL_ADDRESS ? RPC[requirement.chain].nativeCurrency.symbol : token
    )
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
          isLoading={isValidating}
          // error={error}
        />
      </Box>
    </Stack>
  )
}

export default PoapPaymentFeeCurrency
