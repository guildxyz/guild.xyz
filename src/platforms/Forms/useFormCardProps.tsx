import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import rewards from "platforms/rewards"
import { GuildPlatformWithOptionalId, PlatformName } from "types"

const useFormCardProps = (guildPlatform: GuildPlatformWithOptionalId) => {
  const circleBgColor = useColorModeValue("gray.700", "blackAlpha.300")

  const { form } = useGuildForm(guildPlatform.platformGuildData.formId)

  return {
    type: "FORM" as PlatformName,
    image: (
      <Circle size={10} bgColor={circleBgColor}>
        <Icon as={rewards.FORM.icon} color="white" />
      </Circle>
    ),
    name: form?.name ?? rewards.FORM.name,
  }
}

export default useFormCardProps
