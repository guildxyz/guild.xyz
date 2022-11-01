import {
  Button,
  ChakraProps,
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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import { Web3Provider } from "@ethersproject/providers"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsMember from "components/[guild]/hooks/useIsMember"
import { Cardholder } from "phosphor-react"
import QRCode from "qrcode"
import { useState } from "react"
import { Role } from "types"

type Props = {
  role: Role
}

const STYLES: ChakraProps = {
  flexShrink: 0,
  borderRadius: "lg",
  position: { base: "absolute", md: "relative" },
  left: 0,
  bottom: 0,
  width: { base: "full", md: "auto" },
  borderTopRadius: { base: 0, md: "lg" },
  justifyContent: { base: "space-between", md: "start" },
  px: { base: 5, md: 3 },
  py: { base: 2, md: 0 },
  ml: { base: "0 !important", md: "2 !important" },
}

const GeneratePassButton = ({ role }: Props): JSX.Element => {
  const { hasAccess, data } = useAccess(role.id)
  const isMember = useIsMember()
  const { name, imageUrl, id } = useGuild()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const [platform, setPlatform] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generatePass = async (device: string) => {
    setPlatform(device)

    // Get signature
    let signature = ""
    let signatureMessage = ""
    try {
      const provider = new Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      signatureMessage = `Sign this message to generate a pass with guild.xyz \n${Date.now()}`
      signature = await signer.signMessage(signatureMessage)
    } catch (error) {
      console.log("## Signature Error", error)
      return
    }

    // Send request
    setIsLoading(true)
    const payload = {
      chainId: 1,
      image: imageUrl,
      guildName: name,
      guildRoleName: role.name,
      guildRoleId: role.id,
      platform: device,
      signature,
      signatureMessage,
      barcode: {
        message: JSON.stringify({
          guildId: id,
          guildName: name,
          roleId: role.id,
          roleName: role.name,
        }),
      },
    }

    try {
      const response = await fetch("/api/ethpass/create", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: new Headers({
          "content-type": "application/json",
        }),
      })

      if (response.status === 200) {
        const json = await response.json()

        console.log("## POST Result", json)
        setFileUrl(json.fileURL)
        QRCode.toDataURL(json.fileURL, {}, function (error, url) {
          if (error) throw error
          setQrCode(url)
        })
        onOpen()
      } else if (response.status === 401) {
        console.log(`Unable to verify ownership: ${response.statusText}`)
      } else {
        try {
          const { error, message } = await response.json()
          console.log(error || message)
        } catch {
          console.log(`${response.status}: ${response.statusText}`)
        }
      }
    } catch (error) {
      console.log("## POST Error", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (hasAccess && isMember)
    return (
      <>
        <Popover>
          {({ onClose: closePopover }) => (
            <>
              <PopoverTrigger>
                <Button
                  size="sm"
                  colorScheme="purple"
                  leftIcon={
                    !isMobile &&
                    (isLoading ? (
                      <Spinner size="xs" />
                    ) : (
                      <Cardholder width={"0.9em"} height="0.9em" />
                    ))
                  }
                  rightIcon={
                    isMobile &&
                    (isLoading ? (
                      <Spinner size="xs" />
                    ) : (
                      <Cardholder width={"0.9em"} height="0.9em" />
                    ))
                  }
                  isDisabled={isLoading}
                  {...STYLES}
                >
                  Generate Pass
                </Button>
              </PopoverTrigger>
              <PopoverContent mr={{ base: 0, md: 5 }}>
                <PopoverArrow />
                <PopoverHeader py={1}>
                  <Text textAlign="center" fontSize="sm" fontWeight="semibold">
                    Select Platform
                  </Text>
                </PopoverHeader>
                <PopoverBody>
                  <Flex gap="2">
                    <Button
                      onClick={() => {
                        closePopover()
                        generatePass("apple")
                      }}
                      flex="1"
                      size="sm"
                    >
                      Apple Wallet
                    </Button>
                    <Button
                      onClick={() => {
                        closePopover()
                        generatePass("google")
                      }}
                      flex="1"
                      size="sm"
                    >
                      Google Wallet
                    </Button>
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>

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
      </>
    )
}

export default GeneratePassButton
