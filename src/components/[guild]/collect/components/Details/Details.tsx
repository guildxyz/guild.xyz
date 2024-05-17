import { SimpleGrid, Skeleton, Text } from "@chakra-ui/react"
import { useCollectNftContext } from "components/[guild]/collect/components/CollectNftContext"
import Section from "components/common/Section"
import { CHAIN_CONFIG } from "wagmiConfig/chains"
import useNftDetails from "../../hooks/useNftDetails"
import BlockExplorerLink from "./components/BlockExplorerLink"
import InfoBlock from "./components/InfoBlock"

const Details = () => {
  const { chain, nftAddress } = useCollectNftContext()
  const { maxSupply, soulbound, isLoading } = useNftDetails(chain, nftAddress)

  return (
    <Section title="Details" spacing={3}>
      <SimpleGrid spacing={3} columns={{ base: 2, sm: 4, md: 2, lg: 4 }}>
        <InfoBlock label="Network">{CHAIN_CONFIG[chain].name}</InfoBlock>

        <InfoBlock label="Contract">
          <BlockExplorerLink chain={chain} address={nftAddress} path="token" />
        </InfoBlock>

        <InfoBlock label="Transferable">{soulbound ? "No" : "Yes"}</InfoBlock>

        <InfoBlock label="Supply">
          <Skeleton isLoaded={!isLoading}>
            <Text as="span" fontSize="md" colorScheme="gray">
              {typeof maxSupply !== "bigint"
                ? "Loading..."
                : maxSupply === BigInt(0)
                ? "Unlimited"
                : maxSupply.toString()}
            </Text>
          </Skeleton>
        </InfoBlock>
      </SimpleGrid>
    </Section>
  )
}

export default Details
