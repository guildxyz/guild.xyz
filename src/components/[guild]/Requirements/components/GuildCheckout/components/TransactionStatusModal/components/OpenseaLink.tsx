import { Icon, Text } from "@chakra-ui/react"
import Link from "components/common/Link"
import { ArrowSquareOut } from "phosphor-react"
import {
  GuildCredentialsSupportedChain,
  GUILD_CREDENTIAL_CONTRACT,
} from "utils/guildCheckout/constants"
import { useMintCredentialContext } from "../../../MintCredentialContext"

const OpenseaLink = (): JSX.Element => {
  const { credentialChain, mintedTokenId } = useMintCredentialContext()
  const openseaBaseUrl: Record<GuildCredentialsSupportedChain, string> = {
    POLYGON_MUMBAI: "https://testnets.opensea.io/assets/mumbai",
  }

  if (!mintedTokenId) return null

  return (
    <Text mb={6} colorScheme="gray">
      <Link
        isExternal
        href={`${openseaBaseUrl[credentialChain]}/${GUILD_CREDENTIAL_CONTRACT[credentialChain].address}/${mintedTokenId}`}
      >
        View on OpenSea
        <Icon ml={1} as={ArrowSquareOut} />
      </Link>
    </Text>
  )
}

export default OpenseaLink
