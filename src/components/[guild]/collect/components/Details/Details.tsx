import {
  Divider,
  Flex,
  HStack,
  Icon,
  Img,
  Skeleton,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import Link from "components/common/Link"
import { openseaBaseUrl } from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusModal/components/OpenseaLink"
import { Chain, RPC } from "connectors"
import { ArrowSquareOut } from "phosphor-react"
import useNftDetails from "../../hooks/useNftDetails"
import useTopCollectors from "../../hooks/useTopCollectors"
import Section from "../Section"
import CopyableNftDetailsAddress from "./components/CopyableNftDetailsAddress"
import InfoBlock from "./components/InfoBlock"

type Props = {
  chain: Chain
  address: string
}

const Details = ({ chain, address }: Props) => {
  const { colorMode } = useColorMode()

  const chainName = RPC[chain].chainName
  const {
    data: nftDetails,
    isValidating: isNftDetailsValidating,
    error: nftDetailsError,
  } = useNftDetails(chain, address)
  const {
    data: topCollectors,
    isValidating: isTopCollectorsValidatin,
    error: topCollectorsError,
  } = useTopCollectors()

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

      <CopyableNftDetailsAddress label="Contract" address={address} />

      <CopyableNftDetailsAddress
        label="Creator"
        address={nftDetails?.creator}
        isValidating={isNftDetailsValidating}
        error={nftDetailsError}
      />

      <Divider />

      <Flex flexWrap="wrap">
        {openseaBaseUrl[chain] && (
          <Link
            href={`${openseaBaseUrl[chain]}/${address}`}
            isExternal
            colorScheme="gray"
            mr={4}
          >
            <Img src={"/requirementLogos/opensea.svg"} boxSize={"1em"} mr="1.5" />
            View on OpenSea
            <Icon ml={1.5} as={ArrowSquareOut} />
          </Link>
        )}

        <Link
          href={`${RPC[chain].blockExplorerUrls[0]}/token/${address}`}
          isExternal
          colorScheme="gray"
        >
          <Img
            src={RPC[chain]?.blockExplorerIcons[colorMode]}
            boxSize={"1em"}
            mr="1.5"
          />
          View on explorer
          <Icon ml={1.5} as={ArrowSquareOut} />
        </Link>
      </Flex>
    </Section>
  )
}

export default Details
