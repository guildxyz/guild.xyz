import { Icon, Img, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Link from "components/common/Link"
import { Chains } from "connectors"
import { ArrowSquareOut } from "phosphor-react"
import {
  GUILD_CREDENTIAL_CONTRACT,
  GuildCredentialsSupportedChain,
} from "utils/guildCheckout/constants"
import { useMintCredentialContext } from "../../../MintCredentialContext"

const OpenseaLink = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const { mintedTokenId } = useMintCredentialContext()

  const openseaBaseUrl: Record<GuildCredentialsSupportedChain, string> = {
    POLYGON_MUMBAI: "https://testnets.opensea.io/assets/mumbai",
  }

  if (!mintedTokenId) return null

  return (
    <Text mb={6} colorScheme="gray">
      <Link
        isExternal
        href={`${openseaBaseUrl[Chains[chainId]]}/${
          GUILD_CREDENTIAL_CONTRACT[Chains[chainId]].address
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
