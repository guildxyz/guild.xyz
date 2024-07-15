import { Center, Icon } from "@chakra-ui/react"
import { IconProps } from "@phosphor-icons/react/dist/lib/types"
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
