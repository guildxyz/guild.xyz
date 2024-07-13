import { IconButton, useDisclosure } from "@chakra-ui/react"
import { GearSix } from "@phosphor-icons/react/GearSix"
import EditCampaignModal from "../AccessHub/components/CampaignCards/components/EditCampaignModal"
import { useThemeContext } from "../ThemeContext"
import useRoleGroup from "../hooks/useRoleGroup"

const EditCampaignButton = () => {
  const group = useRoleGroup()

  const { textColor, buttonColorScheme } = useThemeContext()

  const { isOpen, onOpen, onClose } = useDisclosure()

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
        onSuccess={onClose}
      />
    </>
  )
}
export default EditCampaignButton
