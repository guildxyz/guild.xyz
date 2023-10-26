import { IconButton, useDisclosure } from "@chakra-ui/react"
import { GearSix } from "phosphor-react"
import EditCampaignModal from "../AccessHub/components/CampaignCards/components/EditCampaignModal"
import useRoleGroup from "../hooks/useRoleGroup"
import { useThemeContext } from "../ThemeContext"

const EditCampaignButton = () => {
  const group = useRoleGroup()

  const { textColor, buttonColorScheme } = useThemeContext()

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <IconButton
        icon={<GearSix />}
        aria-label="Edit campaign"
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
