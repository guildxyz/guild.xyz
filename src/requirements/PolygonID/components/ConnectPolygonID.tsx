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
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import ErrorAlert from "components/common/ErrorAlert"
import { Modal } from "components/common/Modal"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import useShowErrorToast from "hooks/useShowErrorToast"
import { ArrowsClockwise } from "phosphor-react"
import { QRCodeSVG } from "qrcode.react"
import { useEffect } from "react"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"

const ConnectPolygonID = (props: ButtonProps) => {
  const { id: userId } = useUser()
  const { id, roleId, type, data, chain } = useRequirementContext()
  const { onOpen, onClose, isOpen } = useDisclosure()

  const { reqAccesses } = useRoleMembership(roleId)

  const reqAccess = reqAccesses?.find((err) => err.requirementId === id)
  const errorType = reqAccess?.errorType

  // close modal (and stop revalidating access) on successful connect
  useEffect(() => {
    if (!errorType) onClose()
  }, [errorType, onClose])

  if (!userId || (!!reqAccess && !errorType)) return null

  return (
    <>
      <Button
        size="xs"
        onClick={onOpen}
        colorScheme="purple"
        leftIcon={<Img src="/requirementLogos/polygonId_white.svg" width="1.5em" />}
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
        type={(chain === "POLYGON" ? `${type}_MAIN` : type) as any}
        data={data}
      ></ConnectPolygonIDModal>
    </>
  )
}

type ConnectPolygonIDModalProps = {
  isOpen: boolean
  onClose: () => void
  type:
    | "POLYGON_ID_QUERY"
    | "POLYGON_ID_BASIC"
    | "POLYGON_ID_QUERY_MAIN"
    | "POLYGON_ID_BASIC_MAIN"
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
      ? [
          `/v2/util/gate-callbacks/session?requirementType=${type}`,
          { body: { query: data?.query } },
        ]
      : null,
    fetcherWithSign
  )

  const qrSize = useBreakpointValue({ base: 300, md: 400 })

  return (
    <Modal
      size={"lg"}
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
                  <QRCodeSVG value={JSON.stringify(response)} size={qrSize} />
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
                <Text my="8" textAlign="center">
                  Scan with your Polygon ID app, then re-check access below! The
                  modal will automatically close on successful connect
                </Text>
                <RecheckConnectionButton />
              </>
            )}
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const RecheckConnectionButton = (): JSX.Element => {
  const showErrorToast = useShowErrorToast()

  const { triggerMembershipUpdate, isLoading } = useMembershipUpdate({
    onError: (error) => {
      const errorMsg = "Couldn't check access"
      const correlationId = error.correlationId
      showErrorToast(
        correlationId
          ? {
              error: errorMsg,
              correlationId,
            }
          : errorMsg
      )
    },
  })

  return (
    <Button
      onClick={() => triggerMembershipUpdate()}
      colorScheme="green"
      isLoading={isLoading}
      w="full"
    >
      Check connection
    </Button>
  )
}

export default ConnectPolygonID
export { ConnectPolygonIDModal }
