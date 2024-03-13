import { useDisclosure } from "@chakra-ui/react"
import DeleteButton from "components/[guild]/DeleteButton"
import ConfirmationAlert from "components/create-guild/Requirements/components/ConfirmationAlert"
import useDeleteRole from "./hooks/useDeleteRole"

type Props = {
  roleId: number
  onDrawerClose: () => void
}

const DeleteRoleButton = ({ roleId, onDrawerClose }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onSuccess = () => {
    onClose()
    onDrawerClose()
  }

  const { onSubmit, isLoading } = useDeleteRole(roleId, onSuccess)

  return (
    <>
      <DeleteButton label="Delete role" onClick={onOpen} />
      <ConfirmationAlert
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onSubmit}
        title="Delete role"
        description="Are you sure you want to delete this role?"
        confirmationText="Delete"
      />
    </>
  )
}

export default DeleteRoleButton
