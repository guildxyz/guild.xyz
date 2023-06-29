import { SimpleGrid, Skeleton, Text } from "@chakra-ui/react"
import { useCollectNftContext } from "components/[guild]/Requirements/components/GuildCheckout/components/CollectNftContext"
import Section from "components/common/Section"
import { RPC } from "connectors"
import useNftDetails from "../../hooks/useNftDetails"
import BlockExplorerLink from "./components/BlockExplorerLink"
import InfoBlock from "./components/InfoBlock"

const Details = () => {
  const { chain, address } = useCollectNftContext()
  const chainName = RPC[chain].chainName
  const {
    data: nftDetails,
    isValidating: isNftDetailsValidating,
    error: nftDetailsError,
  } = useNftDetails(chain, address)

  return (
    <Section title="Details" spacing={3}>
      <SimpleGrid spacing={3} columns={{ base: 2, sm: 4, md: 2, lg: 4 }}>
        <InfoBlock label="Standard">
          <Skeleton isLoaded={!isNftDetailsValidating}>
            <Text as="span" fontSize="md" colorScheme="gray">
              {nftDetailsError ? "Couldn't fetch" : nftDetails?.standard}
            </Text>
          </Skeleton>
        </InfoBlock>

        <InfoBlock label="Network">{chainName}</InfoBlock>
        <InfoBlock label="Contract">
          <BlockExplorerLink chain={chain} address={address} />
        </InfoBlock>

        <InfoBlock label="Creator">
          <BlockExplorerLink
            chain={chain}
            address={nftDetails?.creator}
            isValidating={isNftDetailsValidating}
            error={nftDetailsError}
          />
        </InfoBlock>
      </SimpleGrid>
    </Section>
  )
}

export default Details
