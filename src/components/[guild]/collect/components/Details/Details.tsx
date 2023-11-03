import { SimpleGrid, Skeleton, Text } from "@chakra-ui/react"
import { CHAIN_CONFIG } from "chains"
import { useCollectNftContext } from "components/[guild]/collect/components/CollectNftContext"
import Section from "components/common/Section"
import useNftDetails from "../../hooks/useNftDetails"
import BlockExplorerLink from "./components/BlockExplorerLink"
import InfoBlock from "./components/InfoBlock"

const Details = () => {
  const { chain, nftAddress } = useCollectNftContext()
  const {
    standard,
    creator,
    isLoading,
    error: nftDetailsError,
  } = useNftDetails(chain, nftAddress)

  return (
    <Section title="Details" spacing={3}>
      <SimpleGrid spacing={3} columns={{ base: 2, sm: 4, md: 2, lg: 4 }}>
        <InfoBlock label="Standard">
          <Skeleton isLoaded={!isLoading}>
            <Text as="span" fontSize="md" colorScheme="gray">
              {nftDetailsError ? "Couldn't fetch" : standard ?? "Loading..."}
            </Text>
          </Skeleton>
        </InfoBlock>

        <InfoBlock label="Network">{CHAIN_CONFIG[chain].name}</InfoBlock>

        <InfoBlock label="Contract">
          <BlockExplorerLink chain={chain} address={nftAddress} path="token" />
        </InfoBlock>

        <InfoBlock label="Creator">
          <BlockExplorerLink
            chain={chain}
            address={creator}
            isValidating={isLoading}
            error={nftDetailsError}
          />
        </InfoBlock>
      </SimpleGrid>
    </Section>
  )
}

export default Details
