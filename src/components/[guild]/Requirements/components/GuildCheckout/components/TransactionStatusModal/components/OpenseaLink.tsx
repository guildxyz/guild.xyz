import { Icon, Img, Text } from "@chakra-ui/react"
import { Chains } from "chains"
import { useCollectNftContext } from "components/[guild]/collect/components/CollectNftContext"
import Link from "components/common/Link"
import { ArrowSquareOut } from "phosphor-react"
import { openseaBaseUrl } from "utils/guildCheckout/constants"
import { useChainId } from "wagmi"

const OpenseaLink = (): JSX.Element => {
  const chainId = useChainId()
  const { nftAddress } = useCollectNftContext()

  if (!openseaBaseUrl[Chains[chainId]]) return null

  return (
    <Text mb={6} colorScheme="gray">
      <Link isExternal href={`${openseaBaseUrl[Chains[chainId]]}/${nftAddress}`}>
        <Img src={"/requirementLogos/opensea.svg"} boxSize={"1em"} mr="1.5" />
        View on OpenSea
        <Icon ml={1.5} as={ArrowSquareOut} />
      </Link>
    </Text>
  )
}

export default OpenseaLink
