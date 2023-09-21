import { Circle, Icon, Img } from "@chakra-ui/react"
import { IconProps } from "phosphor-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

import { EventProviderKey, Rest } from "types"

type Size = "sm" | "md"

type Props = {
  type: EventProviderKey
  size?: Size
} & Rest

const icons: Record<
  EventProviderKey,
  ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>> | string
> = {
  LINK3: "/platforms/link3.png",
  EVENTBRITE: "/platforms/eventbrite.png",
  LUMA: "/platforms/luma.png",
}

const colors: Record<EventProviderKey, { bg: string; icon: string }> = {
  LINK3: { bg: "gray.900", icon: "white" },
  EVENTBRITE: { bg: "gray.900", icon: "white" },
  LUMA: { bg: "gray.900", icon: "white" },
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

const EventProviderIcon = ({ type, size = "md", ...rest }: Props): JSX.Element => (
  <Circle
    bgColor={colors[type].bg}
    color={colors[type].icon}
    size={sizes[size].bg}
    {...rest}
  >
    {typeof icons[type] === "string" ? (
      <Img
        boxSize={sizes[size].bg}
        src={icons[type] as string}
        borderRadius={"full"}
      />
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

export default EventProviderIcon
