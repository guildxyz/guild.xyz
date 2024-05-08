import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import rewards from "platforms/rewards"
import { GuildPlatformWithOptionalId, PlatformName } from "types"
import { useUserFormSubmission } from "./hooks/useFormSubmissions"

const useFormCardProps = (guildPlatform: GuildPlatformWithOptionalId) => {
  const { isAdmin } = useGuildPermission()
  const circleBgColor = useColorModeValue("gray.700", "blackAlpha.300")

  const { form } = useGuildForm(guildPlatform.platformGuildData.formId)
  const { userSubmission } = useUserFormSubmission(form)

  return {
    type: "FORM" as PlatformName,
    image: (
      <Circle size={10} bgColor={circleBgColor}>
        <Icon as={rewards.FORM.icon} color="white" />
      </Circle>
    ),
    name: form?.name ?? rewards.FORM.name,
    shouldHide: !isAdmin && !!userSubmission,
  }
}

export default useFormCardProps
