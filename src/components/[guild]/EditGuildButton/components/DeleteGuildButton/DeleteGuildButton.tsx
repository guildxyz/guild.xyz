import { Text } from "@chakra-ui/react"
import DeleteButton from "components/[guild]/DeleteButton"
import { useFormContext } from "react-hook-form"
import useDeleteGuild from "./hooks/useDeleteGuild"

const DeleteGuildButton = (): JSX.Element => {
  const { reset } = useFormContext()
  const { onSubmit, isLoading, isSigning } = useDeleteGuild(reset)

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
