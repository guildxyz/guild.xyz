import { Link } from "@chakra-ui/next-js"
import { Icon, Img, Text } from "@chakra-ui/react"
import { ArrowSquareOut } from "phosphor-react"
import { GUILD_PIN_CONTRACTS, openseaBaseUrl } from "utils/guildCheckout/constants"
import { useChainId } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import { useMintGuildPinContext } from "../../../MintGuildPinContext"

const GuildPinOpenseaLink = (): JSX.Element => {
  const chainId = useChainId()
  const { mintedTokenId } = useMintGuildPinContext()

  if (!mintedTokenId || !openseaBaseUrl[Chains[chainId]]) return null

  return (
    <Text mb={6} colorScheme="gray">
      <Link
        isExternal
        href={`${openseaBaseUrl[Chains[chainId]]}/${
          GUILD_PIN_CONTRACTS[Chains[chainId]]
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
