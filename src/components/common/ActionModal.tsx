import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react"
import { PropsWithChildren, useRef } from "react"
import ColorButton from "./ColorButton"

type Props = {
  buttonStyle?: "simple" | "color"
  buttonIcon: JSX.Element
  okButtonLabel: string
  okButtonColor: string
  title: string
  isLoading?: boolean
  isDisabled?: boolean
  onButtonClick: () => void
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const ActionModal = ({
  buttonStyle = "simple",
  buttonIcon,
  okButtonLabel,
  okButtonColor,
  title,
  isLoading,
  isDisabled,
  onButtonClick,
  isOpen,
  onOpen,
  onClose,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const cancelRef = useRef()
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })

  return (
    <>
      {buttonStyle === "simple" ? (
        <IconButton
          aria-label="Delete"
          minW={12}
          rounded="2xl"
          isLoading={isLoading}
          onClick={onOpen}
          icon={buttonIcon}
        />
      ) : (
        <ColorButton
          color="red.500"
          rounded="2xl"
          isLoading={isLoading}
          onClick={onOpen}
        >
          {buttonIcon}
        </ColorButton>
      )}

      <AlertDialog
        motionPreset={transition}
        leastDestructiveRef={cancelRef}
        {...{ isOpen, onClose }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{title}</AlertDialogHeader>
            <AlertDialogBody>{children}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme={okButtonColor}
                isDisabled={isDisabled}
                isLoading={isLoading}
                onClick={() => onButtonClick()}
                ml={3}
              >
                {okButtonLabel}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default ActionModal
