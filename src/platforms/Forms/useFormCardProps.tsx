import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { PlatformName } from "types"

const useFormCardProps = () => {
  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  return {
    type: "FORM" as PlatformName,
    image: (
      <Circle size={10} bgColor={circleBgColor}>
        <Icon as={platforms.FORM.icon} color="white" />
      </Circle>
    ),
    name: platforms.FORM.name,
  }
}

export default useFormCardProps
