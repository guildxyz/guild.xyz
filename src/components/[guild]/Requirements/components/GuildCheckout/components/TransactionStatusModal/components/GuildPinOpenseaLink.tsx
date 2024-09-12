import { Link } from "@chakra-ui/next-js"
import { Icon, Img, Text } from "@chakra-ui/react"
import { consts } from "@guildxyz/types"
import { ArrowSquareOut } from "@phosphor-icons/react"
import { openseaBaseUrl } from "utils/guildCheckout/constants"
import { isGuildPinSupportedChain } from "utils/guildCheckout/utils"
import { useChainId } from "wagmi"
import { Chain, Chains } from "wagmiConfig/chains"
import { useMintGuildPinContext } from "../../../MintGuildPinContext"

const GuildPinOpenseaLink = (): JSX.Element => {
  const chainId = useChainId()
  const chain = Chains[chainId] as Chain
  const { mintedTokenId } = useMintGuildPinContext()

  if (!mintedTokenId || !isGuildPinSupportedChain(chain) || !openseaBaseUrl[chain])
    return null

  return (
    <Text mb={6} colorScheme="gray">
      <Link
        isExternal
        href={`${openseaBaseUrl[chain]}/${
          consts.PinContractAddresses[chain]
        }/${mintedTokenId}`}
      >
        <Img src={"/requirementLogos/opensea.svg"} boxSize={"1em"} mr="1.5" />
        View on OpenSea
        <Icon ml={1.5} as={ArrowSquareOut} />
      </Link>
    </Text>
  )
}

export default GuildPinOpenseaLink
