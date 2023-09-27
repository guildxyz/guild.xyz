import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { reactMarkdownComponents } from "components/[guild]/collect/components/RichTextDescription"
import { PropsWithChildren } from "react"
import ReactMarkdown from "react-markdown"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ViewFullTextModal = ({
  isOpen,
  onClose,
  children,
}: PropsWithChildren<Props>) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalCloseButton />

      <ModalBody pt={8}>
        {typeof children === "string" ? (
          <ReactMarkdown components={reactMarkdownComponents}>
            {children}
          </ReactMarkdown>
        ) : (
          children
        )}
      </ModalBody>
    </ModalContent>
  </Modal>
)

export default ViewFullTextModal
