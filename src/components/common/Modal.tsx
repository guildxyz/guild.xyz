import {
  AlertDialog as ChakraAlert,
  AlertDialogProps,
  Modal as ChakraModal,
  ModalProps,
  useBreakpointValue,
} from "@chakra-ui/react"

const transitionValues = { base: "slideInBottom", sm: "scale" }

const Modal = ({
  children,
  ...rest
}: Omit<ModalProps, "lockFocusAcrossFrames">): JSX.Element => {
  const transition = useBreakpointValue<any>(transitionValues)

  return (
    <ChakraModal motionPreset={transition} {...rest} lockFocusAcrossFrames>
      {children}
    </ChakraModal>
  )
}

const Alert = ({
  children,
  ...rest
}: Omit<AlertDialogProps, "lockFocusAcrossFrames">): JSX.Element => {
  const transition = useBreakpointValue<any>(transitionValues)

  return (
    <ChakraAlert motionPreset={transition} {...rest} lockFocusAcrossFrames>
      {children}
    </ChakraAlert>
  )
}

export { Modal, Alert }
