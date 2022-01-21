import { Checkbox, Text } from "@chakra-ui/react"
import DeleteButton from "components/[guild]/DeleteButton"
import usePersonalSign from "hooks/usePersonalSign"
import { useState } from "react"
import useDeleteRole from "./hooks/useDeleteRole"

type Props = {
  roleId: number
}

const DeleteRoleButton = ({ roleId }: Props): JSX.Element => {
  const [keepDC, setKeepDC] = useState(false)
  const { onSubmit, isLoading } = useDeleteRole(roleId)
  const { isSigning } = usePersonalSign()

  return (
    <DeleteButton
      title="Delete role"
      isLoading={isLoading}
      loadingText={isSigning ? "Check your wallet" : "Deleting"}
      onClick={() => onSubmit({ deleteFromDiscord: !keepDC })}
    >
      <Text>Are you sure? You can't undo this action afterwards.</Text>
      <Checkbox
        mt="6"
        colorScheme="primary"
        isChecked={keepDC}
        onChange={(e) => setKeepDC(e.target.checked)}
      >
        Keep role on Discord
      </Checkbox>
      <Text ml="6" mt="1" colorScheme="gray">
        This way it'll remain as is for the existing members, but won't be managed
        anymore
      </Text>
    </DeleteButton>
  )
}

export default DeleteRoleButton
