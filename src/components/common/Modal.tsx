import { Modal as ChakraModal, useBreakpointValue } from "@chakra-ui/react"

type Props = {
  isOpen: boolean
  onClose: () => void
  children: JSX.Element[]
}

const Modal = ({ isOpen, onClose, children }: Props): JSX.Element => {
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })

  return (
    <ChakraModal motionPreset={transition} isOpen={isOpen} onClose={onClose}>
      {children}
    </ChakraModal>
  )
}

export default Modal
