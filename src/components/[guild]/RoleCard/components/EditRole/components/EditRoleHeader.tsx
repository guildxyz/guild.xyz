import { HStack, Icon, IconButton } from "@chakra-ui/react"
import SetVisibility from "components/[guild]/SetVisibility"
import useVisibilityModalProps from "components/[guild]/SetVisibility/hooks/useVisibilityModalProps"
import useGuild from "components/[guild]/hooks/useGuild"
import DrawerHeader from "components/common/DrawerHeader"
import { ArrowLeft } from "phosphor-react"
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
      leftElement={
        <IconButton
          aria-label="Back"
          icon={<Icon as={ArrowLeft} boxSize="1.1em" weight="bold" />}
          display={{ base: "flex", md: "none" }}
          borderRadius="full"
          maxW={10}
          maxH={10}
          mr={2}
          onClick={onClose}
        >
          Cancel
        </IconButton>
      }
    >
      <HStack justifyContent={"space-between"} flexGrow={1}>
        <SetVisibility
          entityType="role"
          defaultValues={{}} // TODO: set
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
