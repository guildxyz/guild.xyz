import {
  Box,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import { BoxArrowDown } from "@phosphor-icons/react/BoxArrowDown"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { SectionTitle } from "components/common/Section"
import ExportCard from "./ExportCard"
import useExportMembers from "./useExportMembers"
import useExports from "./useExports"

const ExportMembersModal = ({ isOpen, onClose }) => {
  const { data: exports, mutate } = useExports()

  const { startExport, isStartExportLoading } = useExportMembers(mutate)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      colorScheme={"dark"}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Export members</ModalHeader>
        <ModalBody pt="1">
          <Button
            colorScheme="blue"
            w="full"
            onClick={startExport}
            isLoading={isStartExportLoading}
            loadingText="Starting export"
            leftIcon={<BoxArrowDown />}
            mb="8"
            variant="subtle"
            borderWidth={2}
            borderColor="blue.500"
            size="xl"
          >
            Export currently filtered
          </Button>
          <SectionTitle title="Recent exports" fontSize="md" />
          <Text colorScheme={"gray"} mt="1" mb="3" fontSize="sm">
            You can access your last 15 exports from the last 7 days here
          </Text>
          <Stack mb="6" spacing={2.5}>
            {!exports ? (
              <FallbackText>
                <Spinner mr="3" mb="-2px" size="sm" />
                Loading exports...
              </FallbackText>
            ) : exports?.length ? (
              exports.map((exp) => <ExportCard key={exp.id} exp={exp} />)
            ) : (
              <FallbackText>No recent exports in the guild</FallbackText>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const FallbackText = ({ children }) => (
  <Box p="5" borderWidth={2} borderStyle="dashed" borderRadius={"xl"}>
    <Text colorScheme={"gray"} fontWeight={"medium"}>
      {children}
    </Text>
  </Box>
)

export default ExportMembersModal
