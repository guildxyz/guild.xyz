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
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import ErrorAlert from "components/common/ErrorAlert"
import { ArrowsClockwise } from "phosphor-react"
import { QRCodeSVG } from "qrcode.react"
import { mutate } from "swr"
import useSWRImmutable from "swr/immutable"
import { Role } from "types"

type Props = {
  role: Role
  isOpen: boolean
  onClose: () => void
}

const PolygonIdQRCode = ({ role, isOpen, onClose }: Props) => {
  const { id: userId } = useUser()
  const { id: guildId } = useGuild()
  const QR_URL = `${process.env.NEXT_PUBLIC_POLYGONID_API}/v1/users/${userId}/polygon-id/claim/${guildId}:${role.id}/qrcode`

  const qr = useSWRImmutable(QR_URL)

  const qrSize = useBreakpointValue({ base: 300, md: 400 })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"} colorScheme={"dark"}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader pb={0}>
          <VStack alignItems={"flex-start"}>
            <Text>PolygonID proof</Text>
            <Text fontSize={"md"} colorScheme={"gray"} fontFamily={"body"}>
              {role.name}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalBody pt={8}>
          <Center flexDirection={"column"}>
            {qr.error ? (
              <ErrorAlert label={"Couldn't generate QR code"} />
            ) : qr.isLoading ? (
              <>
                <Spinner size="xl" mt="8" />
                <Text mt="4" mb="8">
                  Generating QR code
                </Text>
              </>
            ) : (
              <>
                <Box borderRadius={"md"} borderWidth={3} overflow={"hidden"}>
                  <QRCodeSVG value={JSON.stringify(qr.data)} size={qrSize} />
                </Box>
                <Button
                  size="xs"
                  borderRadius="lg"
                  mt="2"
                  variant="ghost"
                  leftIcon={<ArrowsClockwise />}
                  isLoading={qr.isLoading}
                  loadingText={"Generating QR code"}
                  color="gray"
                  onClick={() => mutate(QR_URL)}
                >
                  Generate new QR code
                </Button>
                <Text mt="10" textAlign="center">
                  Scan with your Polygon ID app!
                </Text>
              </>
            )}
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default PolygonIdQRCode
