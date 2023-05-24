import { HStack, Skeleton, Td, Text, Tr } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import useGuildPinFee from "../hooks/useGuildPinFee"
import FeesTable from "./FeesTable"
import PriceFallback from "./PriceFallback"

const GuildPinFees = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const { guildPinFee, guildPinFeeError, isGuildPinFeeLoading } = useGuildPinFee()
  const { symbol, decimals } = RPC[Chains[chainId]]?.nativeCurrency ?? {}

  const guildPinFeeInFloat =
    guildPinFee && decimals && parseFloat(formatUnits(guildPinFee, decimals))

  return (
    <FeesTable
      buttonComponent={
        <HStack justifyContent={"space-between"} w="full">
          <Text fontWeight={"medium"}>Minting fee:</Text>

          <PriceFallback pickedCurrency={symbol} error={guildPinFeeError}>
            <Text as="span">
              <Skeleton isLoaded={!isGuildPinFeeLoading}>
                <Text as="span">
                  {guildPinFeeInFloat
                    ? `${Number(guildPinFeeInFloat.toFixed(3))} `
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
              ? `${Number(guildPinFeeInFloat.toFixed(3))} ${symbol}`
              : "Loading"}
          </Skeleton>
        </Td>
      </Tr>

      {/* <Tr>
        <Td>Gas fee</Td>
        <Td isNumeric>Can't calculate in advance</Td>
      </Tr> */}

      <Tr>
        <Td>Total</Td>
        <Td isNumeric color="WindowText">
          {`${
            guildPinFeeInFloat
              ? `${Number(guildPinFeeInFloat.toFixed(3))} `
              : "0.00 "
          } ${symbol}`}{" "}
          + gas
        </Td>
      </Tr>
    </FeesTable>
  )
}

export default GuildPinFees
