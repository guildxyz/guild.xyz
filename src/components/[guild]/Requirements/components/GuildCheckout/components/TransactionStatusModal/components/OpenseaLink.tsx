import { Icon, Img, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Link from "components/common/Link"
import { Chains } from "connectors"
import { ArrowSquareOut } from "phosphor-react"
import { GuildPinsSupportedChain } from "utils/guildCheckout/constants"
import useGuildPinContractsData from "../../../hooks/useGuildPinContractsData"
import { useMintGuildPinContext } from "../../../MintGuildPinContext"

const OpenseaLink = (): JSX.Element => {
  const guildPinContracts = useGuildPinContractsData()
  const { chainId } = useWeb3React()
  const { mintedTokenId } = useMintGuildPinContext()

  const openseaBaseUrl: Record<GuildPinsSupportedChain, string> = {
    // POLYGON_MUMBAI: "https://testnets.opensea.io/assets/mumbai",
    POLYGON: "https://opensea.io/assets/matic",
    BSC: "https://opensea.io/assets/bsc",
    ARBITRUM: "https://opensea.io/assets/bsc",
  }

  if (!mintedTokenId) return null

  return (
    <Text mb={6} colorScheme="gray">
      <Link
        isExternal
        href={`${openseaBaseUrl[Chains[chainId]]}/${
          guildPinContracts[Chains[chainId]].address
        }/${mintedTokenId}`}
      >
        <Img src={"/requirementLogos/opensea.svg"} boxSize={"1em"} mr="1.5" />
        View on OpenSea
        <Icon ml={1.5} as={ArrowSquareOut} />
      </Link>
    </Text>
  )
}

export default OpenseaLink
