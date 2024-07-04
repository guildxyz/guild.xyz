import { HStack, Skeleton, Td, Text, Tr } from "@chakra-ui/react"
import FeePopover from "components/[guild]/Requirements/components/GuildCheckout/components/FeePopover"
import FeesTable from "components/[guild]/Requirements/components/GuildCheckout/components/FeesTable"
import PriceFallback from "components/[guild]/Requirements/components/GuildCheckout/components/PriceFallback"
import useTokenData from "hooks/useTokenData"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { formatUnits } from "viem"
import { useTokenRewardContext } from "./TokenRewardContext"

const TokenClaimFeeTable = () => {
  const {
    fee,
    guildPlatform: {
      platformGuildData: { chain },
    },
  } = useTokenRewardContext()

  const { data: token, isLoading: tokenIsLoading } = useTokenData(
    chain,
    NULL_ADDRESS
  )

  const formattedFee =
    fee.isLoading || tokenIsLoading ? null : formatUnits(fee.amount, token.decimals)

  return (
    <>
      <FeesTable
        buttonComponent={
          <HStack justifyContent={"space-between"} w="full">
            <HStack spacing={1}>
              <Text fontWeight={"medium"}>Claiming fee</Text>
              <FeePopover />
            </HStack>

            <PriceFallback pickedCurrency={token.symbol} error={null}>
              <Skeleton isLoaded={formattedFee !== null}>
                <Text as="span">
                  <Text as="span">
                    {formattedFee} {token.symbol}
                  </Text>
                  <Text as="span" colorScheme="gray">
                    {` + gas`}
                  </Text>
                </Text>
              </Skeleton>
            </PriceFallback>
          </HStack>
        }
      >
        <Tr>
          <Td>Price</Td>
          <Td isNumeric>Free</Td>
        </Tr>

        <Tr>
          <Td>Claiming fee</Td>
          <Td isNumeric>
            {formattedFee} {token.symbol}
          </Td>
        </Tr>

        <Tr>
          <Td>Total</Td>
          <Td isNumeric color="var(--chakra-colors-chakra-body-text)">
            {formattedFee} {token.symbol} + gas
          </Td>
        </Tr>
      </FeesTable>
    </>
  )
}

export default TokenClaimFeeTable
