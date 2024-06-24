import { Box } from "@chakra-ui/react"
import SetVisibility from "components/[guild]/SetVisibility"
import useVisibilityModalProps from "components/[guild]/SetVisibility/hooks/useVisibilityModalProps"
import DrawerHeader from "components/common/DrawerHeader"
import { useFormContext } from "react-hook-form"
import { RoleFormType } from "types"

const AddRoleDrawerHeader = () => {
  const setVisibilityModalProps = useVisibilityModalProps()

  const { setValue, getValues } = useFormContext<RoleFormType>()

  const handleVisibilitySave = ({ visibility, visibilityRoleId }) => {
    setValue("visibility", visibility)
    setValue("visibilityRoleId", visibilityRoleId)
    setVisibilityModalProps.onClose()
  }

  return (
    <DrawerHeader
      title="Add role"
      justifyContent="start"
      spacing={1}
      alignItems="center"
    >
      <Box>
        <SetVisibility
          entityType="role"
          defaultValues={{
            visibility: getValues("visibility"),
            visibilityRoleId: getValues("visibilityRoleId"),
          }}
          onSave={handleVisibilitySave}
          {...setVisibilityModalProps}
        />
      </Box>
    </DrawerHeader>
  )
}

export default AddRoleDrawerHeader
