import { useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import ConfirmationAlert from "components/create-guild/Requirements/components/ConfirmationAlert"
import useDeleteGuild from "./hooks/useDeleteGuild"

const DeleteGuildButton = (): JSX.Element => {
  const { onSubmit, isLoading, isSigning } = useDeleteGuild()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button colorScheme="red" maxW="max-content" onClick={onOpen}>
        Delete guild
      </Button>

      <ConfirmationAlert
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => onSubmit()}
        title="Delete guild"
        description="Are you sure you want to delete this guild?"
        confirmationText="Delete"
        loadingText={isSigning && "Check your wallet"}
      />
    </>
  )
}

export default DeleteGuildButton
