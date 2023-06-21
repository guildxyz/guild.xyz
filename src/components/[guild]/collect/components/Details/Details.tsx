import {
  Divider,
  Flex,
  Heading,
  Icon,
  Img,
  Skeleton,
  Stack,
  Text,
  useColorMode,
  Wrap,
} from "@chakra-ui/react"
import Link from "components/common/Link"
import { openseaBaseUrl } from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusModal/components/OpenseaLink"
import { Chain, RPC } from "connectors"
import { ArrowSquareOut } from "phosphor-react"
import useNftDetails from "../../hooks/useNftDetails"
import useTopCollectors from "../../hooks/useTopCollectors"
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
    <Stack spacing={4}>
      <Heading w="full" as="h3" fontFamily="display" fontSize="2xl">
        Details
      </Heading>

      <Wrap spacingY={4}>
        <Wrap maxW="max-content" spacingY={4}>
          <InfoBlock label="Standard">
            <Skeleton isLoaded={!isNftDetailsValidating}>
              <Text as="span" fontSize="md" colorScheme="gray">
                {nftDetailsError ? "Couldn't fetch" : nftDetails?.standard}
              </Text>
            </Skeleton>
          </InfoBlock>

          <InfoBlock label="Network">{chainName}</InfoBlock>
        </Wrap>

        <Wrap maxW="max-content" spacingY={4}>
          <InfoBlock label="Total collectors">
            <Skeleton isLoaded={!isNftDetailsValidating}>
              <Text as="span" fontSize="md" colorScheme="gray">
                {nftDetailsError
                  ? "Couldn't fetch"
                  : new Intl.NumberFormat("en", {
                      notation: "standard",
                    }).format(nftDetails?.totalCollectors ?? 0)}
              </Text>
            </Skeleton>
          </InfoBlock>

          <InfoBlock label="Unique collectors">
            <Skeleton isLoaded={!isTopCollectorsValidatin}>
              <Text as="span" fontSize="md" colorScheme="gray">
                {topCollectorsError || !topCollectors?.uniqueCollectors
                  ? "Couldn't fetch"
                  : new Intl.NumberFormat("en", {
                      notation: "standard",
                    }).format(topCollectors.uniqueCollectors)}
              </Text>
            </Skeleton>
          </InfoBlock>

          <InfoBlock label="Collected today">
            <Skeleton isLoaded={!isNftDetailsValidating}>
              <Text as="span" fontSize="md" colorScheme="gray">
                {nftDetailsError || !nftDetails?.totalCollectorsToday
                  ? "Couldn't fetch"
                  : new Intl.NumberFormat("en", {
                      notation: "standard",
                    }).format(nftDetails.totalCollectorsToday)}
              </Text>
            </Skeleton>
          </InfoBlock>
        </Wrap>
      </Wrap>

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
    </Stack>
  )
}

export default Details
