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
import FeesTable from "components/[guild]/Requirements/components/GuildCheckout/components/FeesTable"
import PriceFallback from "components/[guild]/Requirements/components/GuildCheckout/components/PriceFallback"
import { ArrowSquareOut, Question } from "phosphor-react"
import { formatUnits } from "viem"
import { useTokenRewardContext } from "./TokenRewardContext"

const TokenClaimFeeTable = () => {
  const { fee, token } = useTokenRewardContext()
  const formattedFee =
    fee.isLoading || token.isLoading
      ? null
      : formatUnits(fee.amount, token.data.decimals)

  return (
    <>
      <FeesTable
        mb={3}
        mt={6}
        buttonComponent={
          <HStack justifyContent={"space-between"} w="full">
            <HStack spacing={1}>
              <Text fontWeight={"medium"}>Claiming fee</Text>
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

            <PriceFallback pickedCurrency={token.data.symbol} error={null}>
              <Skeleton isLoaded={formattedFee !== null}>
                <Text as="span">
                  <Text as="span">
                    {formattedFee} {token.data.symbol}
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
          <Td>Caliming fee</Td>
          <Td isNumeric>
            {formattedFee} {token.data.symbol}
          </Td>
        </Tr>

        <Tr>
          <Td>Total</Td>
          <Td isNumeric color="var(--chakra-colors-chakra-body-text)">
            {formattedFee} {token.data.symbol} + gas
          </Td>
        </Tr>
      </FeesTable>
    </>
  )
}

export default TokenClaimFeeTable
