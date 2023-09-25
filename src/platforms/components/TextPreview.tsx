import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import PlatformPreview from "./PlatformPreview"

const TextPreview = (): JSX.Element => {
  const circleBg = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  return (
    <PlatformPreview
      type="TEXT"
      name="Text reward"
      image={
        <Circle
          size={12}
          bgColor={circleBg}
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={platforms.TEXT.icon} boxSize={5} />
        </Circle>
      }
    />
  )
}

export default TextPreview
