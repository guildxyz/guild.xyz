import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react"
import { PropsWithChildren, useState } from "react"

type Props = {
  modal: JSX.Element
}

const EventCard = ({ children, modal }: PropsWithChildren<Props>): JSX.Element => {
  const [isOpen, showModal] = useState(false)

  return (
    <>
      <div
        onClick={() => {
          showModal(true)
        }}
      >
        {" "}
        {children}
      </div>
      <Modal
        colorScheme={"dark"}
        isOpen={isOpen}
        onClose={() => showModal(false)}
        size="lg"
      >
        <ModalCloseButton />
        <ModalOverlay />
        <ModalContent>{modal}</ModalContent>
      </Modal>
    </>
  )
}

export default EventCard
