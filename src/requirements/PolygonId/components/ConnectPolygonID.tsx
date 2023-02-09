import {
  ButtonProps,
  Center,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import ErrorAlert from "components/common/ErrorAlert"
import { Modal } from "components/common/Modal"
import useAccess from "components/[guild]/hooks/useAccess"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useSWRImmutable from "swr/immutable"

const ConnectPolygonID = (props: ButtonProps) => {
  const { id, roleId, type } = useRequirementContext()
  const { onOpen, onClose, isOpen } = useDisclosure()

  const { data: roleAccess } = useAccess(roleId, isOpen && { refreshInterval: 5000 })

  const errorType = roleAccess?.errors?.find(
    (err) => err.requirementId === id
  )?.errorType

  if (!["PLATFORM_NOT_CONNECTED", "PLATFORM_CONNECT_INVALID"].includes(errorType))
    return null

  return (
    <>
      <Button
        size="xs"
        onClick={onOpen}
        colorScheme={"purple"}
        // leftIcon={<Icon as={platforms[platform]?.icon} />}
        iconSpacing="1"
        {...props}
      >
        {`${
          errorType === "PLATFORM_CONNECT_INVALID" ? "Reconnect" : "Connect"
        } PolygonID`}
      </Button>

      <ConnectPolygonIDModal
        onClose={onClose}
        isOpen={isOpen}
      ></ConnectPolygonIDModal>
    </>
  )
}

const ConnectPolygonIDModal = ({ isOpen, onClose }) => {
  const { type, data } = useRequirementContext()

  const {
    data: response,
    isValidating,
    error,
  } = useSWRImmutable(
    isOpen
      ? [`/util/getGateCallback/${type}`, { body: { query: data.query } }]
      : null
  )

  return (
    <Modal
      {...{
        isOpen,
        onClose,
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect PolygonID</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center flexDirection={"column"}>
            {error ? (
              <ErrorAlert label="Couldn't generate QR code" />
            ) : !response && isValidating ? (
              <>
                <Spinner size="xl" mt="8" />
                <Text mt="4" mb="8">
                  Generating QR code
                </Text>
              </>
            ) : (
              <pre>{JSON.stringify(response)}</pre>
            )}
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ConnectPolygonID
