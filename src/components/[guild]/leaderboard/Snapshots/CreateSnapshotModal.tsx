import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import SnapshotTable from "./SnapshotTable"
import { MOCK_SNAPSHOT } from "./ViewSnapshotsModal"

type Props = {
  onClose: () => void
  isOpen: boolean
}

const CreateSnapshotModal = ({ onClose, isOpen }: Props) => {
  return (
    <>
      <Modal size="lg" isOpen={isOpen} onClose={onClose} colorScheme="dark">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text>Create snapshot</Text>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Stack justifyContent={"space-between"} gap={4} mb={5}>
              <Text color={"GrayText"} fontWeight={"medium"}>
                Capture a snapshot of the current leaderboard state to use for token
                rewards or as a requirement for different roles
              </Text>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input />
              </FormControl>
            </Stack>

            <Stack gap={3}>
              <Text fontWeight={"medium"}>Preview</Text>
              <SnapshotTable snapshotData={MOCK_SNAPSHOT} chakraProps={{ mt: 0 }} />
            </Stack>

            <Stack mt={4}>
              <Button colorScheme={"primary"}>Create</Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateSnapshotModal
