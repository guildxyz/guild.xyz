import {
  Box,
  Center,
  HStack,
  IconButton,
  ModalBody,
  ModalHeader,
  Spinner,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import ErrorAlert from "components/common/ErrorAlert"
import { ArrowLeft, ArrowsClockwise } from "phosphor-react"
import { QRCodeSVG } from "qrcode.react"
import { mutate } from "swr"
import { Role } from "types"

type Props = {
  role: Role
  goBack: () => void
}

const PolygonIdQRCode = ({ role, goBack }: Props) => {
  const { id: userId } = useUser()
  const { id: guildId } = useGuild()
  const QR_URL = `/v1/users/${userId}/polygon-id/claim/${guildId}:${role.id}/qrcode`

  /*const claim = useSubmitWithSign(() =>
      fetcher("/v1/polygon-id/claim", {
        method: "POST",
        body: {
          userId: userId,
          guildId: guildId,
          roleId: role.id,
        },
      })
    )
    const qr = useSWR(QR_URL, fetcher)*/

  const qrSize = useBreakpointValue({ base: 300, md: 400 })

  const claim = {
    error: null,
    isLoading: false,
  }

  const qr = {
    error: null,
    isLoading: false,
    data: {
      body: {
        credentials: [
          {
            description:
              "https://raw.githubusercontent.com/guildxyz/polygon-id-schema/main/role.json-ld#GuildCredential",
            id: "b82a9881-87b2-11ee-bcd2-0242ac140005",
          },
        ],
        url: "https://a608-2a02-ab88-7809-ed80-788-b682-fc67-7c1c.ngrok-free.app/v1/agent",
      },
      from: "did:polygonid:polygon:mumbai:2qJ4sqrDWMtKi4DMXNW1v73LifKFv3c3guMo7WXrsP",
      to: "did:polygonid:polygon:mumbai:2qMX52K7uTwrnyzmU4ZgWcvWn5fNNUaGVwwK3Dj4M7",
      id: "58735412-0125-4aba-bf02-ec523241c955",
      thid: "58735412-0125-4aba-bf02-ec523241c955",
      typ: "application/iden3comm-plain-json",
      type: "https://iden3-communication.io/credentials/1.0/offer",
    },
  }

  return (
    <>
      <ModalHeader pb={0}>
        <HStack>
          <IconButton
            rounded="full"
            aria-label="Back"
            size="sm"
            mb="-3px"
            icon={<ArrowLeft size={20} />}
            variant="ghost"
            onClick={goBack}
          />
          <Box>
            <Text>PolygonID proof</Text>
            <Text fontSize={"md"} colorScheme={"gray"} fontFamily={"body"}>
              {role.name}
            </Text>
          </Box>
        </HStack>
      </ModalHeader>
      <ModalBody pt={8}>
        <Center flexDirection={"column"}>
          {claim.error || qr.error ? (
            <ErrorAlert
              label={
                qr.error
                  ? "Couldn't generate QR code"
                  : "Couldn't mint PolygonID proof"
              }
            />
          ) : claim.isLoading || qr.isLoading ? (
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
    </>
  )
}

export default PolygonIdQRCode
