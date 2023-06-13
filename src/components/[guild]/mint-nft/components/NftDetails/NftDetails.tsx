import {
  Collapse,
  Icon,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  Wrap,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Chain, RPC } from "connectors"
import { CaretDown } from "phosphor-react"
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
  const { data: nftDetails, isValidating, error } = useNftDetails(chain, address)
  const uniqueMintersPercentage =
    nftDetails?.totalMinters && nftDetails?.uniqueMinters
      ? (nftDetails.uniqueMinters / nftDetails.totalMinters) * 100
      : 0

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
          <Wrap>
            <SimpleGrid maxW="max-content" columns={2} gap={8} pr={8}>
              {/* TODO */}
              <InfoBlock label="Standard">ERC-721</InfoBlock>

              <InfoBlock label="Network">{chainName}</InfoBlock>
            </SimpleGrid>

            <SimpleGrid maxW="max-content" columns={2} gap={8}>
              <InfoBlock label="Total minters">
                <Skeleton isLoaded={!isValidating}>
                  <Text as="span" fontSize="md" colorScheme="gray">
                    {error
                      ? "Couldn't fetch"
                      : new Intl.NumberFormat("en", {
                          notation: "standard",
                        }).format(nftDetails?.totalMinters ?? 0)}
                  </Text>
                </Skeleton>
              </InfoBlock>

              <InfoBlock label="Unique minters">
                <Skeleton isLoaded={!isValidating}>
                  <Text as="span" fontSize="md" colorScheme="gray">
                    {error
                      ? "Couldn't fetch"
                      : `${new Intl.NumberFormat("en", {
                          notation: "standard",
                        }).format(
                          nftDetails?.uniqueMinters
                        )} (${uniqueMintersPercentage})%`}
                  </Text>
                </Skeleton>
              </InfoBlock>
            </SimpleGrid>
          </Wrap>

          <CopyableNftDetailsAddress label="Contract" address={address} />

          <CopyableNftDetailsAddress
            label="Creator"
            address={nftDetails?.creator}
            isValidating={isValidating}
            error={error}
          />
        </Stack>
      </Collapse>
    </Stack>
  )
}

export default NftDetails
