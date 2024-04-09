import {
  HStack,
  Icon,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react"
import FeesTable from "components/[guild]/Requirements/components/GuildCheckout/components/FeesTable"
import PriceFallback from "components/[guild]/Requirements/components/GuildCheckout/components/PriceFallback"
import { ArrowSquareOut, Question } from "phosphor-react"

const ClaimFeeTable = () => {
  return (
    <>
      <FeesTable
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

            <PriceFallback pickedCurrency={"UNI"} error={null}>
              <Text as="span">
                <Text as="span">2.0 UNI</Text>
                <Text as="span" colorScheme="gray">
                  {` + gas`}
                </Text>
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
          <Td>Caliming fee</Td>
          <Td isNumeric>2.0 UNI</Td>
        </Tr>

        <Tr>
          <Td>Total</Td>
          <Td isNumeric color="var(--chakra-colors-chakra-body-text)">
            2.0 UNI + gas
          </Td>
        </Tr>
      </FeesTable>
    </>
  )
}

export default ClaimFeeTable
