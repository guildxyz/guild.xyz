import {
  AlertDialog as ChakraAlert,
  Modal as ChakraModal,
  useBreakpointValue,
} from "@chakra-ui/react"
import { FocusableElement } from "@chakra-ui/utils"
import { PropsWithChildren, RefObject } from "react"
import { Rest } from "types"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
} & Rest

const transitionValues = { base: "slideInBottom", sm: "scale" }

const Modal = ({
  isOpen,
  onClose,
  children,
  ...rest
}: PropsWithChildren<ModalProps>): JSX.Element => {
  const transition = useBreakpointValue<any>(transitionValues)

  return (
    <ChakraModal motionPreset={transition} {...{ isOpen, onClose, ...rest }}>
      {children}
    </ChakraModal>
  )
}

type AlertProps = ModalProps & { leastDestructiveRef: RefObject<FocusableElement> }

const Alert = ({
  isOpen,
  onClose,
  leastDestructiveRef,
  children,
  ...rest
}: PropsWithChildren<AlertProps>): JSX.Element => {
  const transition = useBreakpointValue<any>(transitionValues)

  return (
    <ChakraAlert
      motionPreset={transition}
      {...{ isOpen, onClose, leastDestructiveRef, ...rest }}
    >
      {children}
    </ChakraAlert>
  )
}

export { Modal, Alert }
