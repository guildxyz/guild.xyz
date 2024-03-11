import { useDisclosure } from "@chakra-ui/react"
import DeleteButton from "components/[guild]/DeleteButton"
import ConfirmationAlert from "components/create-guild/Requirements/components/ConfirmaionAlert"
import useDeleteGuild from "./hooks/useDeleteGuild"

type Props = {
  beforeDelete?: () => void
}

const DeleteGuildButton = ({ beforeDelete }: Props): JSX.Element => {
  const { onSubmit, isLoading } = useDeleteGuild()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <DeleteButton label="Delete guild" onClick={onOpen} />
      <ConfirmationAlert
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {
          beforeDelete?.()
          onSubmit()
        }}
        title="Delete guild"
        description="Are you sure you want to delete this guild?"
        confirmationText="Delete"
      />
    </>
  )
}

export default DeleteGuildButton
