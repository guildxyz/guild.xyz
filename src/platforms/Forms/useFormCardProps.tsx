import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import platforms from "platforms/platforms"
import { GuildPlatform, PlatformName } from "types"

const useFormCardProps = (guildPlatform: GuildPlatform) => {
  const circleBgColor = useColorModeValue("gray.700", "blackAlpha.300")

  const { form } = useGuildForm(guildPlatform.platformGuildData.formId)

  return {
    type: "FORM" as PlatformName,
    image: (
      <Circle size={10} bgColor={circleBgColor}>
        <Icon as={platforms.FORM.icon} color="white" />
      </Circle>
    ),
    name: form?.name ?? platforms.FORM.name,
  }
}

export default useFormCardProps
