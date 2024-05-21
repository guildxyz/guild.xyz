import { HStack, Skeleton, StackProps, Td, Text, Tr } from "@chakra-ui/react"
import FeesTable from "components/[guild]/Requirements/components/GuildCheckout/components/FeesTable"
import {
  CollectNftForm,
  useCollectNftContext,
} from "components/[guild]/collect/components/CollectNftContext"
import { useWatch } from "react-hook-form"
import { formatUnits } from "viem"
import { CHAIN_CONFIG } from "wagmiConfig/chains"
import useGuildFee from "../../../hooks/useGuildFee"
import useNftDetails from "../../../hooks/useNftDetails"

const NftFeesTable = ({ ...rest }: StackProps) => {
  const { chain, nftAddress } = useCollectNftContext()

  const claimAmountFromForm = useWatch<CollectNftForm, "amount">({
    name: "amount",
  })
  const claimAmount = claimAmountFromForm ?? 1

  const { guildFee } = useGuildFee(chain)
  const formattedGuildFee = guildFee
    ? Number(formatUnits(guildFee, CHAIN_CONFIG[chain].nativeCurrency.decimals)) *
      claimAmount
    : undefined

  const { fee } = useNftDetails(chain, nftAddress)
  const formattedFee =
    typeof fee === "bigint"
      ? Number(formatUnits(fee, CHAIN_CONFIG[chain].nativeCurrency.decimals)) *
        claimAmount
      : undefined

  const isFormattedGuildFeeLoaded = typeof formattedGuildFee === "number"
  const isFormattedFeeLoaded = typeof formattedFee === "number"

  return (
    <FeesTable
      buttonComponent={
        <HStack justifyContent="space-between" w="full">
          <Text fontWeight="medium">Collecting fee:</Text>

          <Text as="span">
            <Skeleton
              display="inline"
              isLoaded={isFormattedGuildFeeLoaded && isFormattedFeeLoaded}
            >
              {isFormattedGuildFeeLoaded && isFormattedFeeLoaded
                ? `${Number((formattedGuildFee + formattedFee).toFixed(5))} ${
                    CHAIN_CONFIG[chain].nativeCurrency.symbol
                  }`
                : "Loading"}
            </Skeleton>
            <Text as="span" colorScheme="gray">
              {" + gas"}
            </Text>
          </Text>
        </HStack>
      }
      {...rest}
    >
      <Tr>
        <Td>NFT price</Td>
        <Td isNumeric>
          <Skeleton display="inline" isLoaded={isFormattedFeeLoaded}>
            {isFormattedFeeLoaded
              ? `${Number(formattedFee.toFixed(6))} ${
                  CHAIN_CONFIG[chain].nativeCurrency.symbol
                }`
              : "Loading"}
          </Skeleton>
        </Td>
      </Tr>

      <Tr>
        <Td>Collecting fee</Td>
        <Td isNumeric>
          <Skeleton display="inline" isLoaded={isFormattedGuildFeeLoaded}>
            {isFormattedGuildFeeLoaded
              ? `${Number(formattedGuildFee.toFixed(6))} ${
                  CHAIN_CONFIG[chain].nativeCurrency.symbol
                }`
              : "Loading"}
          </Skeleton>
        </Td>
      </Tr>

      <Tr>
        <Td>Total</Td>
        <Td isNumeric color="var(--chakra-colors-chakra-body-text)">
          <Text as="span">
            <Skeleton
              display="inline"
              isLoaded={isFormattedGuildFeeLoaded && isFormattedFeeLoaded}
            >
              {isFormattedGuildFeeLoaded && isFormattedFeeLoaded
                ? `${Number((formattedGuildFee + formattedFee).toFixed(5))} ${
                    CHAIN_CONFIG[chain].nativeCurrency.symbol
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

export default NftFeesTable
