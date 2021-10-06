import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import ColorButton from "components/common/ColorButton"
import { Gear } from "phosphor-react"
import { useRef, useState } from "react"
import { useGuild } from "../Context"

const EditButton = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [keepDC, setKeepDC] = useState(false)
  const cancelRef = useRef()
  const { id, themeColor } = useGuild()
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })

  return (
    <>
      <ColorButton
        color="primary.500"
        rounded="2xl"
        // isLoading={isLoading}
        onClick={onOpen}
      >
        <Icon as={Gear} />
      </ColorButton>

      <AlertDialog
        motionPreset={transition}
        leastDestructiveRef={cancelRef}
        {...{ isOpen, onClose }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Edit Guild</AlertDialogHeader>

            <AlertDialogBody>
              <Text>Current theme color: {themeColor}</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="primary"
                onClick={() => console.log("onClick")}
                ml={3}
              >
                Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default EditButton
