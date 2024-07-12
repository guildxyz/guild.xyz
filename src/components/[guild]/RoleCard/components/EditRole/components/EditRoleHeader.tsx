import { HStack } from "@chakra-ui/react"
import SetVisibility, { SetVisibilityForm } from "components/[guild]/SetVisibility"
import useVisibilityModalProps from "components/[guild]/SetVisibility/hooks/useVisibilityModalProps"
import useGuild from "components/[guild]/hooks/useGuild"
import DrawerHeader from "components/common/DrawerHeader"
import { useFormContext, useWatch } from "react-hook-form"
import { RoleEditFormData } from "../hooks/useEditRoleForm"
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

  const visibility = useWatch({ name: "visibility" })
  const visibilityRoleId = useWatch({ name: "visibilityRoleId" })

  const { setValue } = useFormContext<RoleEditFormData>()

  const handleVisibilitySave = ({
    visibility: newVisibility,
    visibilityRoleId: newVisibilityRoleId,
  }: SetVisibilityForm) => {
    setValue("visibility", newVisibility, {
      shouldDirty: true,
    })
    setValue("visibilityRoleId", newVisibilityRoleId, {
      shouldDirty: true,
    })
    setVisibilityModalProps.onClose()
  }

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
            visibility: visibility,
            visibilityRoleId: visibilityRoleId,
          }}
          onSave={handleVisibilitySave}
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
