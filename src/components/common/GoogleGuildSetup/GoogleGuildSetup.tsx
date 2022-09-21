import {
  ButtonGroup,
  GridItem,
  ModalBody,
  ModalCloseButton,
  ModalContent,
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
import { AnimatePresence } from "framer-motion"
import { Check, CopySimple } from "phosphor-react"
import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
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

const AddDocumentModal = ({ isOpen, onClose = undefined }) => {
  const guildGoogleEmailAddress = "guild-xyz@guildxyz.iam.gserviceaccount.com"
  const { hasCopied, onCopy } = useClipboard(guildGoogleEmailAddress)

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent minW={{ base: "auto", md: "2xl" }}>
        <ModalHeader>Share your documents with Guild.xyz</ModalHeader>
        {onClose && <ModalCloseButton />}
        <ModalBody as={Stack} spacing="4">
          <Text as="span" w="full">
            Invite the official Guild.xyz email address,
            <ButtonGroup isAttached display="flex" my="2">
              <Button variant="outline" isDisabled opacity="1 !important">
                {guildGoogleEmailAddress}
              </Button>
              <Button
                flexShrink="0"
                onClick={onCopy}
                colorScheme="blue"
                rightIcon={hasCopied ? <Check /> : <CopySimple />}
              >
                {hasCopied ? "Copied" : `Copy`}
              </Button>
            </ButtonGroup>
            as an editor to the file you want to gate so it can manage accesses.
          </Text>
          <video src="/videos/google-config-guide.webm" muted autoPlay loop>
            Your browser does not support the HTML5 video tag.
          </video>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default GoogleGuildSetup
