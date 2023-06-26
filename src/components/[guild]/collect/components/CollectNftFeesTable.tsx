import { HStack, Skeleton, Td, Text, Tr } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useCollectNftContext } from "components/[guild]/Requirements/components/GuildCheckout/components/CollectNftContext"
import FeesTable from "components/[guild]/Requirements/components/GuildCheckout/components/FeesTable"
import { RPC } from "connectors"
import useNftDetails from "../hooks/useNftDetails"

type Props = {
  bgColor?: string
}

const CollectNftFeesTable = ({ bgColor }: Props) => {
  const { chain, address } = useCollectNftContext()
  const { data } = useNftDetails(chain, address)
  const formattedFee = data?.fee
    ? Number(formatUnits(data.fee, RPC[chain].nativeCurrency.decimals))
    : undefined

  return (
    <FeesTable
      buttonComponent={
        <HStack justifyContent={"space-between"} w="full">
          <Text fontWeight={"medium"}>Minting fee:</Text>

          <Text as="span">
            <Text as="span">{`${formattedFee} ${RPC[chain].nativeCurrency.symbol}`}</Text>
            <Text as="span" colorScheme="gray">
              {" + gas"}
            </Text>
          </Text>
        </HStack>
      }
      bgColor={bgColor}
    >
      <Tr>
        <Td>Price</Td>
        <Td isNumeric>Free</Td>
      </Tr>

      <Tr>
        <Td>Minting fee</Td>
        <Td isNumeric>
          <Skeleton
            isLoaded={true}
          >{`${formattedFee} ${RPC[chain].nativeCurrency.symbol}`}</Skeleton>
        </Td>
      </Tr>

      <Tr>
        <Td>Total</Td>
        <Td isNumeric color="WindowText">
          {`${formattedFee} ${RPC[chain].nativeCurrency.symbol} + gas`}
        </Td>
      </Tr>
    </FeesTable>
  )
}

export default CollectNftFeesTable
