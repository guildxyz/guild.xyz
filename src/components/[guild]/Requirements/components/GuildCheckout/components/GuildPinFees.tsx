import {
  HStack,
  Icon,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react"
import { CHAIN_CONFIG } from "chains"
import useGuild from "components/[guild]/hooks/useGuild"
import { ArrowSquareOut, Question } from "phosphor-react"
import { formatUnits } from "viem"
import useGuildPinFee from "../hooks/useGuildPinFee"
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
            <Popover placement="top" trigger="hover">
              <PopoverTrigger>
                <Icon as={Question} color="gray" />
              </PopoverTrigger>
              <PopoverContent w="max-content">
                <PopoverArrow />
                <PopoverBody fontSize="sm">
                  {`Learn more about `}
                  <Link
                    isExternal
                    href="https://help.guild.xyz/en/articles/8193498-guild-base-fee"
                  >
                    Guild base fee <Icon as={ArrowSquareOut} ml={1} />
                  </Link>
                </PopoverBody>
              </PopoverContent>
            </Popover>
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
        <Td isNumeric color="WindowText">
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
