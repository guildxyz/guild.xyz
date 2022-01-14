import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { Alert } from "components/common/Modal"
import Section from "components/common/Section"
import usePersonalSign from "hooks/usePersonalSign"
import { TrashSimple } from "phosphor-react"
import { useRef } from "react"
import useDeleteGuild from "./hooks/useDeleteGuild"

const DeleteGuildCard = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, isLoading } = useDeleteGuild()
  const { isSigning } = usePersonalSign()

  const cancelRef = useRef()

  return (
    <Card p="8" w="full">
      <Section title="Danger zone" alignItems="flex-start">
        <Button
          colorScheme="red"
          variant="outline"
          onClick={onOpen}
          leftIcon={<Icon as={TrashSimple} />}
        >
          Delete guild
        </Button>
        <Alert {...{ isOpen, onClose, leastDestructiveRef: cancelRef }}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>Delete guild</AlertDialogHeader>
              <AlertDialogBody>
                <Text>Are you sure? You can't undo this action afterwards.</Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  isLoading={isLoading}
                  loadingText={isSigning ? "Check your wallet" : "Deleting"}
                  onClick={() => onSubmit()}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </Alert>
      </Section>
    </Card>
  )
}

export default DeleteGuildCard
