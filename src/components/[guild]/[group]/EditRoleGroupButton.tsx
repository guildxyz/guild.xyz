import { IconButton, useDisclosure } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { GearSix } from "phosphor-react"
import EditRoleGroupModal from "../AccessHub/components/RoleGroupCards/components/EditRoleGroupModal"
import useGroup from "../hooks/useGroup"
import useGuild from "../hooks/useGuild"
import { useThemeContext } from "../ThemeContext"

const EditRoleGroupButton = () => {
  const router = useRouter()

  const { urlName } = useGuild()
  const group = useGroup()

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

      <EditRoleGroupModal
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
export default EditRoleGroupButton
