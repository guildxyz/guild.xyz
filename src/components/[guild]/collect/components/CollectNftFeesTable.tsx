import { HStack, Skeleton, Td, Text, Tr } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useCollectNftContext } from "components/[guild]/collect/components/CollectNftContext"
import FeesTable from "components/[guild]/Requirements/components/GuildCheckout/components/FeesTable"
import { RPC } from "connectors"
import useGuildFee from "../hooks/useGuildFee"
import useNftDetails from "../hooks/useNftDetails"

type Props = {
  bgColor?: string
}

const CollectNftFeesTable = ({ bgColor }: Props) => {
  const { chain, address } = useCollectNftContext()

  const { guildFee } = useGuildFee(chain)
  const formattedGuildFee = guildFee
    ? Number(formatUnits(guildFee, RPC[chain].nativeCurrency.decimals))
    : undefined

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
            <Skeleton
              display="inline"
              isLoaded={!!formattedGuildFee && !!formattedFee}
            >
              {formattedGuildFee && formattedFee
                ? `${Number((formattedGuildFee + formattedFee).toFixed(5))} ${
                    RPC[chain].nativeCurrency.symbol
                  }`
                : "Loading"}
            </Skeleton>
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
        <Td isNumeric>
          <Skeleton display="inline" isLoaded={!!formattedFee}>
            {formattedFee
              ? `${formattedFee} ${RPC[chain].nativeCurrency.symbol}`
              : "Loading"}
          </Skeleton>
        </Td>
      </Tr>

      <Tr>
        <Td>Minting fee</Td>
        <Td isNumeric>
          <Skeleton display="inline" isLoaded={!!formattedGuildFee}>
            {formattedGuildFee
              ? `${formattedGuildFee} ${RPC[chain].nativeCurrency.symbol}`
              : "Loading"}
          </Skeleton>
        </Td>
      </Tr>

      <Tr>
        <Td>Total</Td>
        <Td isNumeric color="WindowText">
          <Text as="span">
            <Skeleton display="inline" isLoaded={!!formattedFee}>
              {formattedGuildFee && formattedFee
                ? `${Number((formattedGuildFee + formattedFee).toFixed(5))} ${
                    RPC[chain].nativeCurrency.symbol
                  }`
                : "Loading"}
            </Skeleton>
            <Text as="span">{" + gas"}</Text>
          </Text>
        </Td>
      </Tr>
    </FeesTable>
  )
}

export default CollectNftFeesTable
