import { Modal as ChakraModal, useBreakpointValue } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
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

export { Modal, Alert }
