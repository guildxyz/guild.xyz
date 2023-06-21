import {
  Collapse,
  Icon,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  Wrap,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Chain, RPC } from "connectors"
import { CaretDown } from "phosphor-react"
import useTopMinters from "../../hooks/useTopMinters"
import CopyableNftDetailsAddress from "./components/CopyableNftDetailsAddress"
import InfoBlock from "./components/InfoBlock"
import useNftDetails from "./hooks/useNftDetails"

type Props = {
  chain: Chain
  address: string
}

const NftDetails = ({ chain, address }: Props) => {
  const { isOpen, onToggle } = useDisclosure()

  const chainName = RPC[chain].chainName
  const {
    data: nftDetails,
    isValidating: isNftDetailsValidating,
    error: nftDetailsError,
  } = useNftDetails(chain, address)
  const {
    data: topMinters,
    isValidating: isTopMintersValidatin,
    error: topMintersError,
  } = useTopMinters()

  return (
    <Stack spacing={4}>
      <Button
        maxW="max-content"
        variant="unstyled"
        fontFamily="display"
        fontSize="2xl"
        fontWeight="bold"
        onClick={onToggle}
        rightIcon={
          <Icon
            as={CaretDown}
            boxSize={5}
            position="relative"
            top={0.5}
            transform={isOpen && "rotate(-180deg)"}
            transition="transform .3s"
          />
        }
      >
        NFT details
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <Stack spacing={4}>
          <Wrap spacingY={4}>
            <Wrap maxW="max-content" spacingY={4}>
              {/* TODO */}
              <InfoBlock label="Standard">ERC-721</InfoBlock>

              <InfoBlock label="Network">{chainName}</InfoBlock>
            </Wrap>

            <Wrap maxW="max-content" spacingY={4}>
              <InfoBlock label="Total minters">
                <Skeleton isLoaded={!isNftDetailsValidating}>
                  <Text as="span" fontSize="md" colorScheme="gray">
                    {nftDetailsError
                      ? "Couldn't fetch"
                      : new Intl.NumberFormat("en", {
                          notation: "standard",
                        }).format(nftDetails?.totalMinters ?? 0)}
                  </Text>
                </Skeleton>
              </InfoBlock>

              <InfoBlock label="Unique minters">
                <Skeleton isLoaded={!isTopMintersValidatin}>
                  <Text as="span" fontSize="md" colorScheme="gray">
                    {topMintersError || !topMinters?.uniqueMinters
                      ? "Couldn't fetch"
                      : new Intl.NumberFormat("en", {
                          notation: "standard",
                        }).format(topMinters.uniqueMinters)}
                  </Text>
                </Skeleton>
              </InfoBlock>

              <InfoBlock label="Minted today">
                <Skeleton isLoaded={!isNftDetailsValidating}>
                  <Text as="span" fontSize="md" colorScheme="gray">
                    {nftDetailsError || !nftDetails?.totalMintersToday
                      ? "Couldn't fetch"
                      : new Intl.NumberFormat("en", {
                          notation: "standard",
                        }).format(nftDetails.totalMintersToday)}
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
        </Stack>
      </Collapse>
    </Stack>
  )
}

export default NftDetails
