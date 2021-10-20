import { Checkbox, Icon, Text } from "@chakra-ui/react"
import { useGroup } from "components/[group]/Context"
import { useGuild } from "components/[guild]/Context"
import usePersonalSign from "hooks/usePersonalSign"
import { TrashSimple } from "phosphor-react"
import { useState } from "react"
import ActionModal from "../ActionModal"
import useDelete from "./hooks/useDelete"

type Props = {
  simple?: boolean
}

const DeleteButton = ({ simple }: Props): JSX.Element => {
  const [keepDC, setKeepDC] = useState(false)
  const group = useGroup()
  const guild = useGuild()
  const { onSubmit, isLoading } = useDelete(
    group ? "group" : "guild",
    group?.id || guild?.id
  )
  const { isSigning } = usePersonalSign(true)

  return (
    <ActionModal
      title={`Delete ${group ? "Group" : "Guild"}`}
      buttonStyle={simple ? "simple" : "color"}
      buttonIcon={<Icon as={TrashSimple} />}
      isLoading={isLoading || isSigning}
      onButtonClick={() => onSubmit({ deleteFromDiscord: !keepDC })}
      okButtonLabel="Delete"
      okButtonColor="red"
    >
      <Text>Are you sure? You can't undo this action afterwards.</Text>
      {guild && (
        <>
          <Checkbox
            mt="6"
            colorScheme="primary"
            isChecked={keepDC}
            onChange={(e) => setKeepDC(e.target.checked)}
          >
            Keep role and channel on Discord
          </Checkbox>
          <Text ml="6" mt="1" colorScheme="gray">
            This way it'll remain as is for the existing members, but won't be
            managed anymore
          </Text>
        </>
      )}
    </ActionModal>
  )
}

export default DeleteButton
