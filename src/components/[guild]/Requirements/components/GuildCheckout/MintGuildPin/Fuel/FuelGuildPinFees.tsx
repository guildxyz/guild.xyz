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
import { ArrowSquareOut, Question } from "phosphor-react"
import FeesTable from "../../components/FeesTable"
import useFuelGuildPinFee from "./hooks/useFuelGuildPinFee"

const FuelGuildPinFees = (): JSX.Element => {
  const { data, isValidating, error } = useFuelGuildPinFee()

  const formattedFee = data ? Number(Number(data.format()).toFixed(5)) : undefined

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

          <Text as="span">
            <Skeleton isLoaded={!isValidating}>
              <Text as="span">
                {!!data ? `${formattedFee} ` : "0.00 "}
                ETH
              </Text>
              <Text as="span" colorScheme="gray">
                {` + gas`}
              </Text>
            </Skeleton>
          </Text>
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
          <Skeleton isLoaded={!isValidating}>
            {!!data ? `${formattedFee} ETH` : !!error ? "Error" : "Loading"}
          </Skeleton>
        </Td>
      </Tr>

      <Tr>
        <Td>Total</Td>
        <Td isNumeric color="var(--chakra-colors-chakra-body-text)">
          <Skeleton isLoaded={!isValidating}>
            {!!data ? `${formattedFee} ETH + gas` : !!error ? "Error" : "Loading"}
          </Skeleton>
        </Td>
      </Tr>
    </FeesTable>
  )
}

export default FuelGuildPinFees
