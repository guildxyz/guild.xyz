import { HStack } from "@chakra-ui/react"
import SetVisibility from "components/[guild]/SetVisibility"
import useVisibilityModalProps from "components/[guild]/SetVisibility/hooks/useVisibilityModalProps"
import useGuild from "components/[guild]/hooks/useGuild"
import DrawerHeader from "components/common/DrawerHeader"
import { Visibility } from "types"
import DeleteRoleButton from "./DeleteRoleButton"

const EditRoleHeader = ({
  roleId,
  onClose,
}: {
  roleId: number
  onClose: () => void
}) => {
  const setVisibilityModalProps = useVisibilityModalProps()
  const { roles } = useGuild()

  return (
    <DrawerHeader
      title="Edit role"
      justifyContent="start"
      spacing={1}
      alignItems="center"
      w="full"
    >
      <HStack justifyContent={"space-between"} flexGrow={1} w={"fit-content"}>
        <SetVisibility
          entityType="role"
          defaultValues={{
            visibility: Visibility.PUBLIC,
            visibilityRoleId: roleId,
          }} // TODO: set
          onSave={() => {}} // TODO: handle
          {...setVisibilityModalProps}
        />
        {roles?.length > 1 && (
          <DeleteRoleButton roleId={roleId} onDrawerClose={onClose} />
        )}
      </HStack>
    </DrawerHeader>
  )
}

export default EditRoleHeader
