import { CloseButton, Tooltip, useDisclosure } from "@chakra-ui/react"
import ConfirmationAlert from "components/create-guild/Requirements/components/ConfirmaionAlert"
import useRemovePlatform from "./hooks/useRemovePlatform"

type Props = {
  removeButtonColor: string
}

const RemovePlatformButton = ({ removeButtonColor }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, isLoading } = useRemovePlatform(onClose)

  return (
    <>
      <Tooltip label="Remove reward...">
        <CloseButton
          size="sm"
          color={removeButtonColor}
          rounded="full"
          aria-label="Remove reward"
          zIndex="1"
          onClick={onOpen}
        />
      </Tooltip>

      <ConfirmationAlert
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onSubmit}
        title="Remove reward"
        description="Are you sure you want to remove this reward?"
        confirmationText="Remove"
      />
    </>
  )
}

export default RemovePlatformButton
