import { Center, Icon } from "@chakra-ui/react"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import type { PiIconProps } from "react-icons/pi"

const OptionIcon = ({
  as,
}: {
  as: ForwardRefExoticComponent<PiIconProps & RefAttributes<SVGSVGElement>>
}) => (
  <Center boxSize={5} flexShrink={0}>
    <Icon as={as} />
  </Center>
)

export default OptionIcon
