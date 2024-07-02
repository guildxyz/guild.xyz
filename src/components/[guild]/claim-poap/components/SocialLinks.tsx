import { Icon, Link, Wrap } from "@chakra-ui/react"
import type { SocialLinks as SocialLinksType } from "@guildxyz/types"
import { ArrowSquareOut } from "@phosphor-icons/react"
import SocialIcon from "components/[guild]/SocialIcon"
import Section from "components/common/Section"
import { SocialLinkKey } from "types"
import capitalize from "utils/capitalize"

type Props = {
  socialLinks: SocialLinksType
}

const SocialLinks = ({ socialLinks }: Props) => (
  <Section title="Links" spacing={3}>
    <Wrap spacingX={6} spacingY={3}>
      {Object.entries(socialLinks).map(([type, link]) => (
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

export default SocialLinks
