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
import ColorButton from "components/common/ColorButton"
import { TrashSimple } from "phosphor-react"
import { useRef, useState } from "react"
import { useGuild } from "../Context"
import useDeleteMachine from "./hooks/useDeleteMachine"

const DeleteButton = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [keepDC, setKeepDC] = useState(false)
  const { onSubmit, isLoading } = useDeleteMachine()
  const cancelRef = useRef()
  const { id } = useGuild()
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })

  return (
    <>
      <ColorButton
        color="red.500"
        rounded="2xl"
        isLoading={isLoading}
        onClick={onOpen}
      >
        <Icon as={TrashSimple} />
      </ColorButton>

      <AlertDialog
        motionPreset={transition}
        leastDestructiveRef={cancelRef}
        {...{ isOpen, onClose }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Guild</AlertDialogHeader>

            <AlertDialogBody>
              <Text>Are you sure? You can't undo this action afterwards.</Text>
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
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => onSubmit({ id, deleteFromDiscord: !keepDC })}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default DeleteButton
