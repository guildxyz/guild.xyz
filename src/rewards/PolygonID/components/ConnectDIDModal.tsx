import {
  Box,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import { ArrowsClockwise } from "@phosphor-icons/react"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import ErrorAlert from "components/common/ErrorAlert"
import { env } from "env"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
import useToast from "hooks/useToast"
import { QRCodeSVG } from "qrcode.react"
import { useEffect } from "react"
import useSWR from "swr"
import useSWRImmutable from "swr/immutable"
import useConnectedDID from "../hooks/useConnectedDID"

type Props = {
  isOpen: boolean
  onClose: () => void
  onMintPolygonIDProofModalOpen: () => void
}

const ConnectDIDModal = ({
  isOpen,
  onClose,
  onMintPolygonIDProofModalOpen,
}: Props) => {
  const { id: userId } = useUser()
  const toast = useToast()

  const fetcherWithSign = useFetcherWithSign()
  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()

  const {
    data: qrCode,
    isValidating,
    error,
    mutate,
  } = useSWRImmutable(
    isOpen
      ? getKeyForSWRWithOptionalAuth(
          `${env.NEXT_PUBLIC_POLYGONID_API}/v1/users/${userId}/polygon-id/auth`
        )
      : null,
    fetcherWithSign
  )

  const { mutate: mutateConnectedDID } = useConnectedDID()
  const { data: connectedDID } = useSWR<string>(
    userId && isOpen && qrCode
      ? `${env.NEXT_PUBLIC_POLYGONID_API}/v1/users/${userId}/polygon-id?poll=true`
      : null,
    {
      onErrorRetry: (_error, _key, _config, revalidate, _revalidateOps) => {
        setTimeout(() => revalidate(), 3000)
      },
    }
  )

  useEffect(() => {
    if (!isOpen || !connectedDID) return
    toast({ status: "success", title: "Your identity has been authenticated" })
    mutateConnectedDID(connectedDID)
    onClose()
    onMintPolygonIDProofModalOpen()
  }, [
    isOpen,
    connectedDID,
    toast,
    mutateConnectedDID,
    onClose,
    onMintPolygonIDProofModalOpen,
  ])

  const qrSize = useBreakpointValue({ base: 300, md: 400 })

  return (
    <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark" size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Connect PolygonID</ModalHeader>
        <ModalBody pb={4}>
          <Center flexDirection="column">
            {error ? (
              <ErrorAlert label="Couldn't generate QR code" />
            ) : !qrCode && isValidating ? (
              <>
                <Spinner size="xl" mt={8} />
                <Text mt={4} mb={8}>
                  Generating QR code
                </Text>
              </>
            ) : (
              <>
                <Box borderRadius="md" borderWidth={3} overflow="hidden">
                  <QRCodeSVG value={JSON.stringify(qrCode)} size={qrSize} />
                </Box>
                <Button
                  size="xs"
                  borderRadius="lg"
                  mt={2}
                  variant="ghost"
                  leftIcon={<ArrowsClockwise />}
                  isLoading={isValidating}
                  loadingText="Generating QR code"
                  color="gray"
                  onClick={() => mutate()}
                >
                  Generate new QR code
                </Button>
                <Text my="8" textAlign="center">
                  Scan with your Polygon ID app! The modal will automatically close
                  on successful connect.
                </Text>
              </>
            )}
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ConnectDIDModal
