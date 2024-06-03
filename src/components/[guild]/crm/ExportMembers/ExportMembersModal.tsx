import {
  Icon,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { SectionTitle } from "components/common/Section"
import { ArrowsClockwise, Export, Info } from "phosphor-react"
import ExportCard from "./ExportCard"
import useExportMembers from "./useExportMembers"
import useExports from "./useExports"

const ExportMembersModal = ({ isOpen, onClose }) => {
  const { data, isLoading, isValidating, mutate } = useExports()

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
        <ModalBody>
          <Button
            colorScheme="blue"
            w="full"
            onClick={startExport}
            isLoading={isStartExportLoading}
            leftIcon={<Export />}
            mb="8"
            variant="subtle"
            // borderWidth={2}
            size="xl"
          >
            Export currently filtered
          </Button>
          <SectionTitle
            title="Recent exports"
            fontSize="md"
            titleRightElement={
              <>
                <Tooltip
                  label={
                    "You can access your last 15 exports here from the last 7 days"
                  }
                >
                  <Info />
                </Tooltip>

                <IconButton
                  icon={
                    <Icon
                      as={ArrowsClockwise}
                      animation={
                        isValidating ? "rotate 1s infinite linear" : undefined
                      }
                    />
                  }
                  aria-label="Refetch exports"
                  size="xs"
                  variant="ghost"
                  onClick={() => mutate()}
                  isDisabled={isValidating}
                  ml="auto"
                >
                  Refetch
                </IconButton>
              </>
            }
          />
          <Stack mb="6" mt="2" spacing={2.5}>
            {isLoading ? (
              <Text mb="10">Loading exports</Text>
            ) : data?.exports ? (
              data.exports.map((exp) => <ExportCard key={exp.id} exp={exp} />)
            ) : (
              <Text mb="10">Your exports will appear here</Text>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ExportMembersModal
