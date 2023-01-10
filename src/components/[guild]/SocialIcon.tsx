import { Circle, Icon } from "@chakra-ui/react"
import {
  GlobeHemisphereEast,
  IconProps,
  Lightning,
  MediumLogo,
  SpotifyLogo,
  TwitterLogo,
  YoutubeLogo,
} from "phosphor-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import LensLogo from "static/socialIcons/lens.svg"
import MirrorLogo from "static/socialIcons/mirror.svg"
import SubstackLogo from "static/socialIcons/substack.svg"
import { SocialLinkKey } from "types"

type Size = "sm" | "md"

type Props = {
  type: SocialLinkKey
  size?: Size
}

const icons: Record<
  SocialLinkKey,
  ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
> = {
  TWITTER: TwitterLogo,
  LENS: LensLogo,
  YOUTUBE: YoutubeLogo,
  SPOTIFY: SpotifyLogo,
  MIRROR: MirrorLogo,
  MEDIUM: MediumLogo,
  SUBSTACK: SubstackLogo,
  SNAPSHOT: Lightning,
  WEBSITE: GlobeHemisphereEast,
}

const colors: Record<SocialLinkKey, { bg: string; icon: string }> = {
  TWITTER: { bg: "TWITTER.500", icon: "white" },
  LENS: { bg: "BRAND.LENS", icon: "BRAND.LENSDARK" },
  YOUTUBE: { bg: "BRAND.YOUTUBE", icon: "white" },
  SPOTIFY: { bg: "BRAND.SPOTIFY", icon: "white" },
  MIRROR: { bg: "BRAND.MIRROR", icon: "white" },
  MEDIUM: { bg: "BRAND.MEDIUM", icon: "white" },
  SUBSTACK: { bg: "BRAND.SUBSTACK", icon: "white" },
  SNAPSHOT: { bg: "white", icon: "BRAND.SNAPSHOT" },
  WEBSITE: { bg: "gray.900", icon: "white" },
}
const sizes: Record<Size, { bg: number; icon: number }> = {
  sm: {
    bg: 5,
    icon: 3,
  },
  md: {
    bg: 6,
    icon: 4,
  },
}

const SocialIcon = ({ type, size = "md" }: Props): JSX.Element => (
  <Circle bgColor={colors[type].bg} color={colors[type].icon} size={sizes[size].bg}>
    <Icon boxSize={sizes[size].icon} as={icons[type]} />
  </Circle>
)

export default SocialIcon
