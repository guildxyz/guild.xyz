import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react"

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const LoadingModal = ({ isOpen, onClose }: Props) => (
  <Modal isOpen={isOpen} onClose={onClose} size={"xl"} colorScheme={"dark"}>
    <ModalOverlay />
    <ModalContent>
      <ModalCloseButton />
      <ModalHeader pb={0}>
        <Text>Mint PolygonID proofs</Text>
      </ModalHeader>
      <ModalBody pt={8}>
        <Stack gap={3}>
          <Skeleton height={16}></Skeleton>
          <Skeleton height={16}></Skeleton>
        </Stack>
      </ModalBody>
    </ModalContent>
  </Modal>
)
