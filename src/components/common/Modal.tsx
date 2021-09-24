import { Modal as ChakraModal, useBreakpointValue } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  isOpen: boolean
  onClose: () => void
} & Rest

const Modal = ({
  isOpen,
  onClose,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })

  return (
    <ChakraModal motionPreset={transition} {...{ isOpen, onClose, ...rest }}>
      {children}
    </ChakraModal>
  )
}

export default Modal
