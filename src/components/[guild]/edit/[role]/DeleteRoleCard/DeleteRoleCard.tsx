import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Checkbox,
  Icon,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import Section from "components/common/Section"
import usePersonalSign from "hooks/usePersonalSign"
import { TrashSimple } from "phosphor-react"
import { useRef, useState } from "react"
import useDeleteRole from "./hooks/useDeleteRole"

type Props = {
  roleId: number
}

const DeleteRoleCard = ({ roleId }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [keepDC, setKeepDC] = useState(false)
  const { onSubmit, isLoading } = useDeleteRole(roleId)
  const { isSigning } = usePersonalSign()

  const cancelRef = useRef()
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })

  return (
    <Card p="8" w="full">
      <Section title="Danger zone" alignItems="flex-start">
        <Button
          colorScheme="red"
          variant="outline"
          onClick={onOpen}
          leftIcon={<Icon as={TrashSimple} />}
        >
          Delete role
        </Button>
        <AlertDialog
          motionPreset={transition}
          leastDestructiveRef={cancelRef}
          {...{ isOpen, onClose }}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>Delete role</AlertDialogHeader>
              <AlertDialogBody>
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
                  This way it'll remain as is for the existing members, but won't be
                  managed anymore
                </Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  isLoading={isLoading}
                  loadingText={isSigning ? "Check your wallet" : "Deleting"}
                  onClick={() => onSubmit({ deleteFromDiscord: !keepDC })}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Section>
    </Card>
  )
}

export default DeleteRoleCard
