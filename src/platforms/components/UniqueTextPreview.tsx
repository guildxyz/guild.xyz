import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import rewards from "platforms/rewards"
import { useWatch } from "react-hook-form"
import RewardPreview from "./RewardPreview"

const UniqueTextPreview = ({ children }): JSX.Element => {
  const platformGuildData = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData",
  })
  const circleBg = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  return (
    <RewardPreview
      type="UNIQUE_TEXT"
      name={platformGuildData?.name ?? "Unique secret"}
      image={
        platformGuildData?.imageUrl ?? (
          <Circle
            size={12}
            bgColor={circleBg}
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={rewards.UNIQUE_TEXT.icon} boxSize={5} color="white" />
          </Circle>
        )
      }
    >
      {children}
    </RewardPreview>
  )
}

export default UniqueTextPreview
