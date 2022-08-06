import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import { FunctionComponent } from "react"

type Props = {
  icon?: FunctionComponent
  colorScheme?: string
}

const CenterIcon = ({ icon, colorScheme = "gray" }: Props) => {
  const swatch = useColorModeValue(colorScheme === "green" ? "500" : "200", "500")

  return (
    <Circle
      size={5}
      bgColor={`${colorScheme}.${swatch}`}
      color={colorScheme === "green" ? "white" : undefined}
    >
      <Icon boxSize={3} as={icon} />
    </Circle>
  )
}
export default CenterIcon
