import {
  ButtonGroup,
  GridItem,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useClipboard,
  useDisclosure,
  usePrevious,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useCreateGuild from "components/create-guild/hooks/useCreateGuild"
import useUser from "components/[guild]/hooks/useUser"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { AnimatePresence } from "framer-motion"
import { Check, CopySimple, PencilSimple } from "phosphor-react"
import { useContext, useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { PlatformType } from "types"
import AddCard from "../AddCard"
import CardMotionWrapper from "../CardMotionWrapper"
import { Modal } from "../Modal"
import GoogleDocCard, { GoogleSkeletonCard } from "./components/GoogleDocCard"
import GoogleDocSetupCard from "./components/GoogleDocSetupCard"
import useGoogleGateables from "./hooks/useGoogleGateables"

type Props = {
  defaultValues: Record<string, any>
  fieldNameBase?: string
  onSelect?: (dataToAppend: any) => void
  shouldSetName?: boolean
  permissionField?: string
  skipSettings?: boolean
}

const GoogleGuildSetup = ({
  defaultValues,
  fieldNameBase = "",
  onSelect,
  shouldSetName,
  permissionField,
  skipSettings,
}: Props): JSX.Element => {
  const fieldName = `${fieldNameBase}platformGuildId`

  const { googleGateables, isGoogleGateablesLoading } = useGoogleGateables()

  const { isOpen, onClose, onOpen } = useDisclosure()

  const prevGoogleGateables = usePrevious(googleGateables)
  useEffect(() => {
    if (googleGateables?.length > prevGoogleGateables?.length) {
      onClose()
    }
  }, [prevGoogleGateables, googleGateables])

  const { control, setValue, reset, handleSubmit } = useFormContext()
  const platformGuildId = useWatch({ control, name: fieldName })

  const selectedFile = googleGateables?.find(
    (file) => file.platformGuildId === platformGuildId
  )

  const [showForm, setShowForm] = useState(false)

  const resetForm = () => {
    reset(defaultValues)
    setValue(fieldName, null)
  }

  const { onSubmit, isLoading, isSigning, signLoadingText } = useCreateGuild()

  const handleSelect = handleSubmit(onSelect ?? onSubmit)

  useEffect(() => {
    if (selectedFile)
      setTimeout(() => {
        setShowForm(true)
      }, 300)
    else setShowForm(false)
  }, [selectedFile])

  if (isGoogleGateablesLoading)
    return (
      <SimpleGrid
        columns={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 4, md: 6 }}
        alignItems="stretch"
      >
        {[...Array(5)].map((i) => (
          <GridItem key={i}>
            <GoogleSkeletonCard />
          </GridItem>
        ))}
      </SimpleGrid>
    )

  if (googleGateables?.length)
    return (
      <>
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 4, md: 6 }}
          alignItems="stretch"
        >
          <AnimatePresence>
            {(selectedFile ? [selectedFile] : googleGateables).map((file) => (
              <CardMotionWrapper key={file.platformGuildId}>
                <GridItem>
                  <GoogleDocCard
                    file={file}
                    onSelect={
                      selectedFile
                        ? undefined
                        : (newPlatformGuildId: string) => {
                            setValue(fieldName, newPlatformGuildId)
                            if (!fieldNameBase?.length)
                              setValue(`platformGuildName`, file.name)
                            if (shouldSetName) setValue("name", file.name)

                            setValue(`${fieldNameBase}platformGuildData`, {
                              mimeType: file.mimeType,
                              iconLink: file.iconLink,
                            })

                            if (skipSettings) handleSelect()
                          }
                    }
                    onCancel={
                      selectedFile?.platformGuildId !== file.platformGuildId
                        ? undefined
                        : resetForm
                    }
                  />
                </GridItem>
              </CardMotionWrapper>
            ))}

            {!selectedFile && (
              <CardMotionWrapper key={"add-file"}>
                <AddCard text="Select another file" minH={"28"} onClick={onOpen} />
              </CardMotionWrapper>
            )}
          </AnimatePresence>
          {showForm && (
            <GridItem colSpan={2}>
              <GoogleDocSetupCard
                fieldNameBase={fieldNameBase}
                onSubmit={handleSelect}
                isLoading={isLoading || isSigning}
                loadingText={signLoadingText ?? "Creating guild"}
                permissionField={permissionField}
              />
            </GridItem>
          )}
        </SimpleGrid>

        <AddDocumentModal isOpen={isOpen} onClose={onClose} />
      </>
    )

  // if (ready && keyPair && !filteredGoogleGateables?.length)
  return <AddDocumentModal isOpen={true} />
}

const GUILD_EMAIL_ADDRESS = "guild-xyz@guildxyz.iam.gserviceaccount.com"
const AddDocumentModal = ({ isOpen, onClose = undefined }) => {
  const { platformUsers } = useUser()
  const googleAcc = platformUsers?.find(
    (acc) => acc.platformId === PlatformType.GOOGLE
  )

  const { hasCopied, onCopy } = useClipboard(GUILD_EMAIL_ADDRESS)
  const { openAccountModal } = useContext(Web3Connection)

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent minW={{ base: "auto", md: "2xl" }}>
        <ModalHeader>Add document</ModalHeader>
        {onClose && <ModalCloseButton />}
        <ModalBody as={Stack} spacing="4">
          <Text>
            Invite the official Guild.xyz email address as an editor to the file you
            want to gate so it can manage accesses:
          </Text>
          <ButtonGroup isAttached display="flex" my="2">
            <Button
              variant="outline"
              isDisabled
              opacity="1 !important"
              fontWeight={"bold"}
            >
              {GUILD_EMAIL_ADDRESS}
            </Button>
            <Button
              flexShrink="0"
              onClick={onCopy}
              colorScheme="blue"
              rightIcon={hasCopied ? <Check /> : <CopySimple />}
              fontWeight={"bold"}
            >
              {hasCopied ? "Copied" : `Copy`}
            </Button>
          </ButtonGroup>

          <video src="/videos/google-config-guide.webm" muted autoPlay loop>
            Your browser does not support the HTML5 video tag.
          </video>
        </ModalBody>
        <ModalFooter pb="8" pt="5">
          <Text colorScheme={"gray"}>
            You have to be the owner of the file with your connected account:{" "}
            <Button
              variant="link"
              color="inherit"
              onClick={openAccountModal}
              rightIcon={<PencilSimple />}
            >
              {googleAcc?.username}
            </Button>
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default GoogleGuildSetup
