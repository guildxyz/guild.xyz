import { Circle, Icon, Img } from "@chakra-ui/react"
import {
  GlobeHemisphereEast,
  IconProps,
  MediumLogo,
  SpotifyLogo,
  YoutubeLogo,
} from "phosphor-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import XLogo from "static/icons/x.svg"
import MirrorLogo from "static/socialIcons/mirror.svg"
import SubstackLogo from "static/socialIcons/substack.svg"
import { Rest, SocialLinkKey } from "types"

type Size = "sm" | "md"

type Props = {
  type: SocialLinkKey
  size?: Size
} & Rest

const icons: Record<
  SocialLinkKey,
  ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>> | string
> = {
  TWITTER: XLogo,
  LENS: "/requirementLogos/lens.svg",
  YOUTUBE: YoutubeLogo,
  SPOTIFY: SpotifyLogo,
  MIRROR: MirrorLogo,
  MEDIUM: MediumLogo,
  SUBSTACK: SubstackLogo,
  SNAPSHOT: "/requirementLogos/snapshot.png",
  SOUND: "/requirementLogos/sound.png",
  WEBSITE: GlobeHemisphereEast,
  GITHUB: "/platforms/github.png",
}

const colors: Record<SocialLinkKey, { bg: string; icon: string }> = {
  TWITTER: { bg: "TWITTER.500", icon: "white" },
  LENS: { bg: "#ABFE2C", icon: "#00501E" },
  YOUTUBE: { bg: "#FF0000", icon: "white" },
  SPOTIFY: { bg: "#1DB954", icon: "white" },
  MIRROR: { bg: "#007AFF", icon: "white" },
  MEDIUM: { bg: "#000000", icon: "white" },
  SUBSTACK: { bg: "#FF6719", icon: "white" },
  SNAPSHOT: { bg: "white", icon: "#F3B04E" },
  SOUND: { bg: "black", icon: "white" },
  WEBSITE: { bg: "gray.900", icon: "white" },
  GITHUB: { bg: "#202328", icon: "white" },
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

const SocialIcon = ({ type, size = "md", ...rest }: Props): JSX.Element => (
  <Circle
    bgColor={colors[type].bg}
    color={colors[type].icon}
    size={sizes[size].bg}
    {...rest}
  >
    {typeof icons[type] === "string" ? (
      <Img boxSize={sizes[size].bg} src={icons[type] as string} />
    ) : (
      <Icon
        boxSize={sizes[size].icon}
        as={
          icons[type] as ForwardRefExoticComponent<
            IconProps & RefAttributes<SVGSVGElement>
          >
        }
      />
    )}
  </Circle>
)

export default SocialIcon
