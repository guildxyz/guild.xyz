import { HStack, Skeleton, Stack, Text } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import { useGuildCheckoutContext } from "components/[guild]/Requirements/components/GuildCheckout/components/GuildCheckoutContex"
import PriceFallback from "components/[guild]/Requirements/components/GuildCheckout/components/PriceFallback"
import { Chains } from "connectors"
import useTokenData from "hooks/useTokenData"

/**
 * This is copy-pasted from BuyPass and adjusted to work with legacy POAP logic. We
 * will switch to general payment requirement once POAP is a reward
 */
const PoapBuyTotal = (): JSX.Element => {
  const { requirement, pickedCurrency } = useGuildCheckoutContext()
  const {
    vaultData,
    isVaultLoading: isValidating,
    vaultError: error,
  } = usePoapVault(requirement.data.id, Chains[requirement?.chain])
  const { token, fee } = vaultData

  const {
    data: { decimals, symbol },
  } = useTokenData(requirement.chain, token)

  const priceInSellToken = fee && decimals ? Number(formatUnits(fee, decimals)) : 0

  // const { estimatedGasFee } = usePayFee(requirement.data.id)

  const isTooSmallPrice = priceInSellToken < 0.001

  return (
    <Stack>
      <HStack justifyContent="space-between">
        <Text as="span" colorScheme="gray">
          Total
        </Text>

        <PriceFallback {...{ error, pickedCurrency }}>
          <Text as="span">
            <Skeleton isLoaded={!isValidating}>
              <Text as="span" fontWeight="semibold">
                {priceInSellToken
                  ? `${
                      isTooSmallPrice
                        ? "< 0.001"
                        : Number(priceInSellToken.toFixed(3))
                    } `
                  : "0.00 "}
                {symbol}
              </Text>
            </Skeleton>
          </Text>
        </PriceFallback>
      </HStack>

      {/* {estimatedGasFee && (
        <Text as="span" colorScheme="gray" fontSize="sm">
          {`Estimated gas fee: ${parseFloat(
            formatUnits(
              estimatedGasFee,
              RPC[requirement.chain].nativeCurrency.decimals
            )
          ).toFixed(8)} ${RPC[requirement.chain].nativeCurrency.symbol}`}
        </Text>
      )} */}
    </Stack>
  )
}

export default PoapBuyTotal
