import { HStack, Skeleton, Td, Text, Tr } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { formatUnits } from "viem"
import { CHAIN_CONFIG } from "wagmiConfig/chains"
import useGuildPinFee from "../hooks/useGuildPinFee"
import FeePopover from "./FeePopover"
import FeesTable from "./FeesTable"
import PriceFallback from "./PriceFallback"

const GuildPinFees = (): JSX.Element => {
  const { guildPin } = useGuild()
  const { guildPinFee, guildPinFeeError, isGuildPinFeeLoading } = useGuildPinFee()
  const { symbol, decimals } = CHAIN_CONFIG[guildPin.chain].nativeCurrency

  const guildPinFeeInFloat =
    guildPinFee && decimals && parseFloat(formatUnits(guildPinFee, decimals))

  return (
    <FeesTable
      buttonComponent={
        <HStack justifyContent={"space-between"} w="full">
          <HStack spacing={1}>
            <Text fontWeight={"medium"}>Minting fee</Text>
            <FeePopover />
          </HStack>

          <PriceFallback pickedCurrency={symbol} error={guildPinFeeError}>
            <Text as="span">
              <Skeleton isLoaded={!isGuildPinFeeLoading}>
                <Text as="span">
                  {guildPinFeeInFloat
                    ? `${Number(guildPinFeeInFloat.toFixed(5))} `
                    : "0.00 "}
                  {symbol}
                </Text>
                <Text as="span" colorScheme="gray">
                  {` + gas`}
                </Text>
              </Skeleton>
            </Text>
          </PriceFallback>
        </HStack>
      }
    >
      <Tr>
        <Td>Price</Td>
        <Td isNumeric>Free</Td>
      </Tr>

      <Tr>
        <Td>Minting fee</Td>
        <Td isNumeric>
          <Skeleton isLoaded={!!guildPinFeeInFloat}>
            {guildPinFeeInFloat
              ? `${Number(guildPinFeeInFloat.toFixed(10))} ${symbol}`
              : "Loading"}
          </Skeleton>
        </Td>
      </Tr>

      <Tr>
        <Td>Total</Td>
        <Td isNumeric color="var(--chakra-colors-chakra-body-text)">
          {`${
            guildPinFeeInFloat
              ? `${Number(guildPinFeeInFloat.toFixed(5))} `
              : "0.00 "
          } ${symbol}`}{" "}
          + gas
        </Td>
      </Tr>
    </FeesTable>
  )
}

export default GuildPinFees
