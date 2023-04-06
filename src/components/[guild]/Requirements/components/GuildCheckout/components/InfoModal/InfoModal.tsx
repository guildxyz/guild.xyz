import {
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { AnimatePresence } from "framer-motion"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"
import InProgress from "./components/InProgress"
import Success from "./components/Success"
import TxError from "./components/TxError"

type Props = {
  title: string
  progressComponent?: JSX.Element
  successComponent?: JSX.Element
  errorComponent?: JSX.Element
}

const InfoModal = ({
  title,
  progressComponent,
  successComponent,
  errorComponent,
}: Props): JSX.Element => {
  const { isInfoModalOpen, onInfoModalClose, txSuccess, txError } =
    useGuildCheckoutContext()

  return (
    <Modal
      isOpen={isInfoModalOpen}
      onClose={txSuccess ? onInfoModalClose : undefined}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        {txSuccess && <ModalCloseButton />}

        <AnimatePresence>
          {txError ? (
            <TxError>{errorComponent}</TxError>
          ) : txSuccess ? (
            <Success>{successComponent}</Success>
          ) : (
            <InProgress>{progressComponent}</InProgress>
          )}
        </AnimatePresence>
      </ModalContent>
    </Modal>
  )
}

export default InfoModal
