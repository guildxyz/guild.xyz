import { IconButton, useDisclosure } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { GearSix } from "phosphor-react"
import EditCampaignModal from "../AccessHub/components/CampaignCards/components/EditCampaignModal"
import { useThemeContext } from "../ThemeContext"
import useGuild from "../hooks/useGuild"
import useRoleGroup from "../hooks/useRoleGroup"

const EditCampaignButton = () => {
  const router = useRouter()

  const { urlName } = useGuild()
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
        onSuccess={(response) => {
          router?.push(`/${urlName}/${response.urlName}`)
        }}
      />
    </>
  )
}
export default EditCampaignButton
