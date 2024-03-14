import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import rewards from "platforms/rewards"
import { useWatch } from "react-hook-form"
import PlatformPreview from "./PlatformPreview"

const SecretTextPreview = ({ children }): JSX.Element => {
  const platformGuildData = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData",
  })
  const circleBg = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  return (
    <PlatformPreview
      type="TEXT"
      name={platformGuildData?.name ?? "Secret"}
      image={
        platformGuildData?.imageUrl ?? (
          <Circle
            size={12}
            bgColor={circleBg}
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={rewards.TEXT.icon} boxSize={5} color="white" />
          </Circle>
        )
      }
    >
      {children}
    </PlatformPreview>
  )
}

export default SecretTextPreview
