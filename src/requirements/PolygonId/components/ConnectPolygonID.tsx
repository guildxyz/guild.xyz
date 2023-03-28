import {
  Box,
  ButtonProps,
  Center,
  Img,
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
import { ArrowsClockwise } from "phosphor-react"
import { QRCodeSVG } from "qrcode.react"
import { RequirementType } from "requirements"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"

const ConnectPolygonID = (props: ButtonProps) => {
  const { id, roleId, type, data } = useRequirementContext()
  const { onOpen, onClose, isOpen } = useDisclosure()

  const { data: roleAccess } = useAccess(roleId, isOpen && { refreshInterval: 5000 })

  const errorType = roleAccess?.errors?.find(
    (err) => err.requirementId === id
  )?.errorType

  if (
    (type !== "POLYGON_ID_QUERY" && type !== "POLYGON_ID_BASIC") ||
    !["PLATFORM_NOT_CONNECTED", "PLATFORM_CONNECT_INVALID"].includes(errorType)
  )
    return null

  return (
    <>
      <Button
        size="xs"
        onClick={onOpen}
        colorScheme="purple"
        leftIcon={<Img src="requirementLogos/polygonId_white.svg" width="1.5em" />}
        iconSpacing={1}
        {...props}
      >
        {`${
          errorType === "PLATFORM_CONNECT_INVALID" ? "Reconnect" : "Connect"
        } PolygonID`}
      </Button>

      <ConnectPolygonIDModal
        onClose={onClose}
        isOpen={isOpen}
        type={type}
        data={data}
      ></ConnectPolygonIDModal>
    </>
  )
}

type ConnectPolygonIDModalProps = {
  isOpen: boolean
  onClose: () => void
  type: Extract<RequirementType, "POLYGON_ID_QUERY" | "POLYGON_ID_BASIC">
  data: {
    maxAmount?: number
    query?: Record<string, any>
  }
}

const ConnectPolygonIDModal = ({
  isOpen,
  onClose,
  type,
  data,
}: ConnectPolygonIDModalProps) => {
  const fetcherWithSign = useFetcherWithSign()
  const {
    data: response,
    isValidating,
    error,
    mutate,
  } = useSWRImmutable(
    isOpen
      ? [`/util/getGateCallback/${type}`, { body: { query: data.query } }]
      : null,
    fetcherWithSign
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
              <>
                <Box borderRadius={"md"} borderWidth={3} overflow={"hidden"}>
                  <QRCodeSVG value={JSON.stringify(response)} size={300} />
                </Box>
                <Button
                  size="xs"
                  borderRadius="lg"
                  mt="2"
                  variant="ghost"
                  leftIcon={<ArrowsClockwise />}
                  isLoading={isValidating}
                  loadingText={"Generating QR code"}
                  color="gray"
                  onClick={() => mutate()}
                >
                  Generate new QR code
                </Button>
                <Text mt="10" textAlign="center">
                  Scan with your Polygon ID app! The modal will automatically close
                  on successful connect
                </Text>
              </>
            )}
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ConnectPolygonID
export { ConnectPolygonIDModal }
