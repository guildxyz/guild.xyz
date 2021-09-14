import { Modal as ChakraModal, useBreakpointValue } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const Modal = ({
  isOpen,
  onClose,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })

  return (
    <ChakraModal motionPreset={transition} isOpen={isOpen} onClose={onClose}>
      {children}
    </ChakraModal>
  )
}

export default Modal
