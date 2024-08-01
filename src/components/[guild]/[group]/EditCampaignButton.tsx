import { IconButton, useDisclosure } from "@chakra-ui/react"
import { GearSix } from "@phosphor-icons/react"
import { useRouter } from "next/router"
import { Group } from "types"
import EditCampaignModal from "../AccessHub/components/CampaignCards/components/EditCampaignModal"
import { useThemeContext } from "../ThemeContext"
import useGuild from "../hooks/useGuild"
import useRoleGroup from "../hooks/useRoleGroup"

const EditCampaignButton = () => {
  const group = useRoleGroup()
  const { urlName } = useGuild()
  const { replace } = useRouter()

  const { textColor, buttonColorScheme } = useThemeContext()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const onSuccess = (response: Group) => {
    onClose()
    replace(`/${urlName}/${response.urlName}`)
  }

  return (
    <>
      <IconButton
        icon={<GearSix />}
        aria-label="Edit page"
        minW="44px"
        rounded="full"
        colorScheme={buttonColorScheme}
        color={textColor}
        onClick={onOpen}
      />

      <EditCampaignModal
        isOpen={isOpen}
        onClose={onClose}
        groupId={group.id}
        onSuccess={onSuccess}
      />
    </>
  )
}
export default EditCampaignButton
