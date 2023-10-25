import { IconButton, useDisclosure } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { GearSix } from "phosphor-react"
import EditRoleGroupModal from "../AccessHub/components/RoleGroupCards/components/EditRoleGroupModal"
import { useThemeContext } from "../ThemeContext"
import useGuild from "../hooks/useGuild"
import useRoleGroup from "../hooks/useRoleGroup"

const EditRoleGroupButton = () => {
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
