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
  useDisclosure,
} from "@chakra-ui/react"
import { Web3Provider } from "@ethersproject/providers"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
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
  ml: { base: 5 },
}

const GeneratePassButton = ({ role }: Props): JSX.Element => {
  const { hasAccess, data } = useAccess(role.id)
  const { name, imageUrl } = useGuild()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [fileUrl, setFileUrl] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generatePass = async (platform: string) => {
    console.log(name)
    console.log(imageUrl)
    console.log(role.id)
    console.log(role.name)

    // Get signature
    console.log("Waiting for signature...")
    let signature = ""
    let signatureMessage = ""
    try {
      const provider = new Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      signatureMessage = `Sign this message to generate a pass with guild.xyz \n${Date.now()}`
      signature = await signer.signMessage(signatureMessage)
    } catch (error) {
      console.log(error)
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
      platform: platform,
      signature,
      signatureMessage,
      barcode: {
        message: `Guild: ${name}, Role: ${role.id} - ${role.name}`,
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

  if (hasAccess)
    return (
      <>
        <Popover>
          <PopoverTrigger>
            <Button
              size="sm"
              colorScheme="purple"
              leftIcon={isLoading ? <Spinner size="xs" /> : <Cardholder />}
              {...STYLES}
            >
              Generate Pass
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>
              <Text textAlign="center" fontSize="sm" fontWeight="medium">
                Select Platform
              </Text>
            </PopoverHeader>
            <PopoverBody>
              <Flex gap="2">
                <Button onClick={() => generatePass("apple")} flex="1">
                  Apple Wallet
                </Button>
                <Button onClick={() => generatePass("google")} flex="1">
                  Google Wallet
                </Button>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent alignItems="center">
            <ModalHeader>Pass Generated</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Image src={qrCode} alt="Donwload Pass" borderRadius="xl" />
            </ModalBody>

            <ModalFooter>
              <Link
                href="https://ethpass.xyz/"
                target="_blank"
                rel="noreferrer"
                fontSize="sm"
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
