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
  Tooltip,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { SectionTitle } from "components/common/Section"
import { ArchiveBox, Info } from "phosphor-react"
import ExportCard from "./ExportCard"
import useExportMembers from "./useExportMembers"
import useExports from "./useExports"

const ExportMembersModal = ({ isOpen, onClose }) => {
  const { data, mutate } = useExports()

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
            leftIcon={<ArchiveBox />}
            mb="8"
            variant="subtle"
            borderWidth={2}
            borderColor="blue.500"
            size="xl"
          >
            Export currently filtered
          </Button>
          <SectionTitle
            title="Recent exports"
            fontSize="md"
            titleRightElement={
              <Tooltip
                label="You can access your last 15 exports from the last 7 days here"
                hasArrow
              >
                <Info />
              </Tooltip>
            }
          />
          <Stack mb="6" mt="2" spacing={2.5}>
            {!data ? (
              <FallbackText>
                <Spinner mr="3" mb="-2px" size="sm" />
                Loading exports...
              </FallbackText>
            ) : data?.exports?.length ? (
              data.exports.map((exp) => <ExportCard key={exp.id} exp={exp} />)
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
