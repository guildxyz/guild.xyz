import { HStack, Skeleton, Text } from "@chakra-ui/react"
import { Chain, RPC } from "connectors"
import useNftDetails from "../../hooks/useNftDetails"
import Section from "../Section"
import BlockExplorerLink from "./components/BlockExplorerLink"
import InfoBlock from "./components/InfoBlock"

type Props = {
  chain: Chain
  address: string
}

const Details = ({ chain, address }: Props) => {
  const chainName = RPC[chain].chainName
  const {
    data: nftDetails,
    isValidating: isNftDetailsValidating,
    error: nftDetailsError,
  } = useNftDetails(chain, address)

  return (
    <Section title="Details">
      <HStack spacing={8}>
        <InfoBlock label="Standard">
          <Skeleton isLoaded={!isNftDetailsValidating}>
            <Text as="span" fontSize="md" colorScheme="gray">
              {nftDetailsError ? "Couldn't fetch" : nftDetails?.standard}
            </Text>
          </Skeleton>
        </InfoBlock>

        <InfoBlock label="Network">{chainName}</InfoBlock>
      </HStack>

      <BlockExplorerLink label="Contract" chain={chain} address={address} />

      <BlockExplorerLink
        label="Creator"
        chain={chain}
        address={nftDetails?.creator}
        isValidating={isNftDetailsValidating}
        error={nftDetailsError}
      />
    </Section>
  )
}

export default Details
