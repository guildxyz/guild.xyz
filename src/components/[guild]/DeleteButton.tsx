import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonProps,
  Icon,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react"
import { Alert } from "components/common/Modal"
import { TrashSimple } from "phosphor-react"
import { PropsWithChildren, useRef } from "react"

type Props = {
  title: string
} & ButtonProps

const DeleteButton = ({
  title,
  children,
  ...submitButtonProps
}: PropsWithChildren<Props>): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  return (
    <>
      <IconButton
        aria-label={title}
        icon={<Icon as={TrashSimple} />}
        colorScheme="red"
        onClick={onOpen}
        maxW={10}
        maxH={10}
      />
      <Alert leastDestructiveRef={cancelRef} {...{ isOpen, onClose }}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{title}</AlertDialogHeader>
            <AlertDialogBody>{children}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" ml={3} {...submitButtonProps}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </Alert>
    </>
  )
}

export default DeleteButton
