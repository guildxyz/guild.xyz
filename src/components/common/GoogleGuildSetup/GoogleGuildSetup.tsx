import {
  ButtonGroup,
  Circle,
  GridItem,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useClipboard,
  useDisclosure,
  usePrevious,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import useCreateGuild from "components/create-guild/hooks/useCreateGuild"
import useGuild from "components/[guild]/hooks/useGuild"
import { AnimatePresence } from "framer-motion"
import { Check, CopySimple } from "phosphor-react"
import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import AddCard from "../AddCard"
import CardMotionWrapper from "../CardMotionWrapper"
import GoogleDocCard from "./components/GoogleDocCard"
import GoogleDocSetupCard from "./components/GoogleDocSetupCard"
import useGoogleGateables from "./hooks/useGoogleGateables"

type Props = {
  defaultValues: Record<string, any>
  fieldNameBase?: string
  onSelect?: (dataToAppend: any) => void
  shouldSetName?: boolean
}

const GoogleGuildSetup = ({
  defaultValues,
  fieldNameBase,
  onSelect,
  shouldSetName,
}: Props): JSX.Element => {
  const fieldName = fieldNameBase?.length
    ? `${fieldNameBase}.platformGuildId`
    : "platformGuildId"
  const { id, guildPlatforms } = useGuild()
  const guildPlatformIds = guildPlatforms?.map((p) => p.platformGuildId) ?? []

  const { googleGateables, isGoogleGateablesLoading } = useGoogleGateables()

  const filteredGoogleGateables = googleGateables?.filter(
    (file) => !guildPlatformIds.includes(file.platformGuildId)
  )

  const { isOpen, onClose, onOpen } = useDisclosure()

  const prevFilteredGoogleGateables = usePrevious(filteredGoogleGateables)
  useEffect(() => {
    if (filteredGoogleGateables?.length > prevFilteredGoogleGateables?.length) {
      onClose()
    }
  }, [prevFilteredGoogleGateables, filteredGoogleGateables])

  const { control, setValue, reset } = useFormContext()
  const platformGuildId = useWatch({ control, name: fieldName })

  const selectedFile = filteredGoogleGateables?.find(
    (file) => file.platformGuildId === platformGuildId
  )

  const [showForm, setShowForm] = useState(false)

  const resetForm = () => {
    reset(defaultValues)
    setValue(fieldName, null)
  }

  const { onSubmit, isLoading, isSigning, signLoadingText } = useCreateGuild()

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
        {[...Array(5)].map(() => {
          return (
            <GridItem>
              <Card px={{ base: 5, sm: 6 }} py="7">
                <Stack w="full" spacing={4} justifyContent="space-between" h="full">
                  <HStack>
                    <Circle size={10}>
                      <SkeletonCircle size="10" />
                    </Circle>

                    <Stack spacing={3} overflow={"hidden"}>
                      <Skeleton h={3} w={200} />
                      <Skeleton h={2.5} w={20} />
                    </Stack>
                  </HStack>
                  <Skeleton h={10} borderRadius="xl" w="full" />
                </Stack>
              </Card>
            </GridItem>
          )
        })}
      </SimpleGrid>
    )

  if (filteredGoogleGateables?.length)
    return (
      <>
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 4, md: 6 }}
          alignItems="stretch"
        >
          <AnimatePresence>
            {(selectedFile ? [selectedFile] : filteredGoogleGateables).map(
              (file) => (
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

                              setValue(
                                fieldNameBase?.length
                                  ? `${fieldNameBase}.platformGuildData.mimeType`
                                  : "platformGuildData.mimeType",
                                file.mimeType
                              )
                              setValue(
                                fieldNameBase?.length
                                  ? `${fieldNameBase}.platformGuildData.iconLink`
                                  : "platformGuildData.iconLink",
                                file.iconLink
                              )
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
              )
            )}

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
                onSubmit={id ? onSelect : onSubmit}
                isLoading={isLoading || isSigning}
                loadingText={signLoadingText ?? "Creating guild"}
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
            <ButtonGroup isAttached d="flex" my="2">
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
