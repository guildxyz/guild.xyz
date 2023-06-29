import { Icon, Img, Wrap } from "@chakra-ui/react"
import { useCollectNftContext } from "components/[guild]/Requirements/components/GuildCheckout/components/CollectNftContext"
import SocialIcon from "components/[guild]/SocialIcon"
import useGuild from "components/[guild]/hooks/useGuild"
import Link from "components/common/Link"
import Section from "components/common/Section"
import { ArrowSquareOut } from "phosphor-react"
import { SocialLinkKey } from "types"
import capitalize from "utils/capitalize"
import { openseaBaseUrl } from "utils/guildCheckout/constants"

const Links = () => {
  const { chain, address } = useCollectNftContext()
  const { socialLinks } = useGuild()

  return (
    <Section title="Links" spacing={3}>
      <Wrap spacingX={6} spacingY={3}>
        {openseaBaseUrl[chain] && (
          <Link
            href={`${openseaBaseUrl[chain]}/${address}`}
            isExternal
            colorScheme="gray"
            fontWeight="medium"
          >
            <Img src={"/requirementLogos/opensea.svg"} boxSize={5} mr="1.5" />
            OpenSea
            <Icon ml={1.5} as={ArrowSquareOut} />
          </Link>
        )}

        {Object.keys(socialLinks ?? {}).length > 0 &&
          Object.entries(socialLinks).map(([type, link]) => (
            <Link
              key={type}
              href={link}
              isExternal
              colorScheme="gray"
              fontWeight="medium"
            >
              <SocialIcon type={type as SocialLinkKey} size="sm" mr="1.5" />
              {capitalize(type.toLowerCase())}
              <Icon ml={1.5} as={ArrowSquareOut} />
            </Link>
          ))}
      </Wrap>
    </Section>
  )
}

export default Links
