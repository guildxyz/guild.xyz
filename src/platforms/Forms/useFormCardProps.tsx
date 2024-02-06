import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import useForms from "components/[guild]/hooks/useForms"
import platforms from "platforms/platforms"
import { GuildPlatform, PlatformName } from "types"

const useFormCardProps = (guildPlatform: GuildPlatform) => {
  const circleBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  const { data } = useForms()
  const form = data?.find((f) => f.id === guildPlatform.platformGuildData.formId)

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
