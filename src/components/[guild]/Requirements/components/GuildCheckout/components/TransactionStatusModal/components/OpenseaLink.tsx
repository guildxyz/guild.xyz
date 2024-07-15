import { Link } from "@chakra-ui/next-js"
import { Icon, Img, Text } from "@chakra-ui/react"
import { useCollectNftContext } from "components/[guild]/collect/components/CollectNftContext"
import { PiArrowSquareOut } from "react-icons/pi"
import { openseaBaseUrl } from "utils/guildCheckout/constants"
import { useChainId } from "wagmi"
import { Chains } from "wagmiConfig/chains"

const OpenseaLink = (): JSX.Element => {
  const chainId = useChainId()
  const { nftAddress } = useCollectNftContext()

  if (!openseaBaseUrl[Chains[chainId]]) return null

  return (
    <Text mb={6} colorScheme="gray">
      <Link isExternal href={`${openseaBaseUrl[Chains[chainId]]}/${nftAddress}`}>
        <Img src={"/requirementLogos/opensea.svg"} boxSize={"1em"} mr="1.5" />
        View on OpenSea
        <Icon ml={1.5} as={PiArrowSquareOut} />
      </Link>
    </Text>
  )
}

export default OpenseaLink
