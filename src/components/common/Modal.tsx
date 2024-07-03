import {
  AlertDialog as ChakraAlert,
  AlertDialogProps,
  Modal as ChakraModal,
  ModalProps,
  useBreakpointValue,
} from "@chakra-ui/react"

const transitionValues = { base: "slideInBottom", sm: "scale" }

const Modal = ({ children, ...rest }: ModalProps): JSX.Element => {
  const transition = useBreakpointValue<any>(transitionValues)

  return (
    <ChakraModal motionPreset={transition} {...rest}>
      {children}
    </ChakraModal>
  )
}

const Alert = ({ children, ...rest }: AlertDialogProps): JSX.Element => {
  const transition = useBreakpointValue<any>(transitionValues)

  return (
    <ChakraAlert motionPreset={transition} {...rest}>
      {children}
    </ChakraAlert>
  )
}

export { Modal, Alert }
