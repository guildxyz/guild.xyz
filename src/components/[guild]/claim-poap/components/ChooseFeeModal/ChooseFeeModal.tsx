import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { PoapContract } from "types"
import PayFeeButton from "./components/PayFeeButton"

type Props = {
  poapContracts: PoapContract[]
  isOpen: boolean
  onClose: () => void
}

const ChooseFeeModal = ({ poapContracts, isOpen, onClose }: Props): JSX.Element => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Choose currency</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack>
          {poapContracts?.map((poapContract) => (
            <PayFeeButton
              key={poapContract.id}
              chainId={poapContract.chainId}
              vaultId={poapContract.vaultId}
            />
          ))}
        </Stack>
      </ModalBody>
    </ModalContent>
  </Modal>
)

export default ChooseFeeModal
