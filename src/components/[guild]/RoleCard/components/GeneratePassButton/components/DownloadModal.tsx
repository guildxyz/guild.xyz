import {
  Flex,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"

type Props = {
  platform: string
  qrCode: string
  fileUrl: string
  isOpen: boolean
  onClose: () => void
}

const DownloadModal = ({
  platform,
  qrCode,
  fileUrl,
  isOpen,
  onClose,
}: Props): JSX.Element => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent alignItems="center">
      <ModalHeader pr={{ base: 6, md: 10 }}>Pass Generated</ModalHeader>
      <ModalCloseButton />

      <ModalBody>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          gap={4}
        >
          <Text>{`Scan QR code using your device.`}</Text>
          <Image
            src={qrCode}
            alt="Donwload Pass"
            borderRadius="xl"
            maxWidth={250}
            maxHeight={250}
          />

          <Text>Or tap below to download directly on your mobile device.</Text>
          <a href={fileUrl}>
            <Image
              src={`/img/${
                platform && platform === "apple" ? "apple" : "google"
              }-wallet-add.svg`}
              alt="Add To Wallet"
              cursor="pointer"
              height="50px"
            />
          </a>
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Link
          href="https://ethpass.xyz/"
          target="_blank"
          rel="noreferrer"
          fontSize="sm"
          fontWeight="medium"
        >
          powered by ethpass
        </Link>
      </ModalFooter>
    </ModalContent>
  </Modal>
)

export default DownloadModal
