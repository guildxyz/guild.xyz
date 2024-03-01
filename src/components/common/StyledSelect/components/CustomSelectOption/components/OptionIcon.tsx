import { Center, Icon } from "@chakra-ui/react"
import type { IconProps } from "@phosphor-icons/react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

const OptionIcon = ({
  as,
}: {
  as: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
}) => (
  <Center boxSize={5} flexShrink={0}>
    <Icon as={as} />
  </Center>
)

export default OptionIcon
