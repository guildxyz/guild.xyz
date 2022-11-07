import {
  Button,
  ChakraProps,
  Flex,
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
import useShowErrorToast from "hooks/useShowErrorToast"
import { Cardholder } from "phosphor-react"
import QRCode from "qrcode"
import { useState } from "react"
import { Role } from "types"
import DownloadModal from "./components/DownloadModal"

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
  const isMobile = useBreakpointValue({ base: true, md: false })
  const isMember = useIsMember()
  const { hasAccess } = useAccess(role.id)
  const { name, imageUrl, id } = useGuild()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const showErrorToast = useShowErrorToast()

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
      showErrorToast("User denied message signature")
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

        setFileUrl(json.fileURL)
        QRCode.toDataURL(json.fileURL, {}, function (error, url) {
          if (error) throw error
          setQrCode(url)
        })
        onOpen()
      } else if (response.status === 401) {
        showErrorToast(`Unable to verify ownership: ${response.statusText}`)
      } else {
        try {
          const { error, message } = await response.json()
          showErrorToast(error || message)
        } catch {
          showErrorToast(`${response.status}: ${response.statusText}`)
        }
      }
    } catch (error) {
      showErrorToast(error)
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

        <DownloadModal
          platform={platform}
          qrCode={qrCode}
          fileUrl={fileUrl}
          isOpen={isOpen}
          onClose={onClose}
        />
      </>
    )
}

export default GeneratePassButton
