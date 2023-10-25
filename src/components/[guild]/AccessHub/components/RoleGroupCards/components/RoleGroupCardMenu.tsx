import { Box, MenuItem, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import { PencilSimple, TrashSimple } from "phosphor-react"
import useDeleteRoleGroup from "../hooks/useDeleteRoleGroup"

type Props = {
  groupId: number
}

const RoleGroupCardMenu = ({ groupId }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const removeMenuItemColor = useColorModeValue("red.600", "red.300")
  const { onSubmit: onDeleteRoleGroup, isLoading: isDeleteRoleGroupLoading } =
    useDeleteRoleGroup(groupId)

  return (
    <Box position="absolute" top={2} right={2}>
      <PlatformCardMenu>
        <MenuItem icon={<PencilSimple />}>Edit campaign appearance</MenuItem>
        <MenuItem
          icon={<TrashSimple />}
          color={removeMenuItemColor}
          isDisabled={isDeleteRoleGroupLoading}
          onClick={() => onDeleteRoleGroup()}
        >
          Delete campaign
        </MenuItem>
      </PlatformCardMenu>
    </Box>
  )
}
export default RoleGroupCardMenu
