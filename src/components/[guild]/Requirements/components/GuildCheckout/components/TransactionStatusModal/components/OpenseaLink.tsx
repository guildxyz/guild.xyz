import { Icon, Img, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Link from "components/common/Link"
import { Chains } from "connectors"
import { ArrowSquareOut } from "phosphor-react"
import { openseaBaseUrl } from "utils/guildCheckout/constants"
import useGuildPinContractsData from "../../../hooks/useGuildPinContractsData"
import { useMintGuildPinContext } from "../../../MintGuildPinContext"

const OpenseaLink = (): JSX.Element => {
  const guildPinContractsData = useGuildPinContractsData()
  const { chainId } = useWeb3React()
  const { mintedTokenId } = useMintGuildPinContext()

  if (!mintedTokenId || !openseaBaseUrl[Chains[chainId]]) return null

  return (
    <Text mb={6} colorScheme="gray">
      <Link
        isExternal
        href={`${openseaBaseUrl[Chains[chainId]]}/${
          guildPinContractsData[Chains[chainId]].address
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
