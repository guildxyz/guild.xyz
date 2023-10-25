import { Box, MenuItem, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { RoleGroupFormType } from "components/[guild]/CreateRoleGroupModal/components/RoleGroupForm"
import useGroup from "components/[guild]/hooks/useGroup"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import { PencilSimple, TrashSimple } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import useDeleteRoleGroup from "../hooks/useDeleteRoleGroup"
import EditRoleGroupModal from "./EditRoleGroupModal"

type Props = {
  groupId: number
}

const RoleGroupCardMenu = ({ groupId }: Props) => {
  const group = useGroup(groupId)
  const { name, imageUrl, description } = group ?? {}

  const { isOpen, onOpen, onClose } = useDisclosure()

  const removeMenuItemColor = useColorModeValue("red.600", "red.300")
  const { onSubmit: onDeleteRoleGroup, isLoading: isDeleteRoleGroupLoading } =
    useDeleteRoleGroup(groupId)

  const methods = useForm<RoleGroupFormType>({
    mode: "all",
    defaultValues: {
      name,
      imageUrl: imageUrl ?? "",
      description: description ?? "",
    },
  })

  return (
    <Box position="absolute" top={2} right={2}>
      <PlatformCardMenu>
        <MenuItem icon={<PencilSimple />} onClick={onOpen}>
          Edit campaign appearance
        </MenuItem>
        <MenuItem
          icon={<TrashSimple />}
          color={removeMenuItemColor}
          isDisabled={isDeleteRoleGroupLoading}
          onClick={() => onDeleteRoleGroup()}
        >
          Delete campaign
        </MenuItem>
      </PlatformCardMenu>

      <FormProvider {...methods}>
        <EditRoleGroupModal
          isOpen={isOpen}
          onClose={onClose}
          groupId={groupId}
          onSuccess={onClose}
        />
      </FormProvider>
    </Box>
  )
}
export default RoleGroupCardMenu
