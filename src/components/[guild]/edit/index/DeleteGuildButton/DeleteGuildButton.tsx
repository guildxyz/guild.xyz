import { Text } from "@chakra-ui/react"
import DeleteButton from "components/[guild]/DeleteButton"
import usePersonalSign from "hooks/usePersonalSign"
import useDeleteGuild from "./hooks/useDeleteGuild"

const DeleteGuildButton = (): JSX.Element => {
  const { onSubmit, isLoading } = useDeleteGuild()
  const { isSigning } = usePersonalSign()

  return (
    <DeleteButton
      title="Delete guild"
      isLoading={isLoading}
      loadingText={isSigning ? "Check your wallet" : "Deleting"}
      onClick={() => onSubmit()}
    >
      <Text>Are you sure? You can't undo this action afterwards.</Text>
    </DeleteButton>
  )
}

export default DeleteGuildButton
