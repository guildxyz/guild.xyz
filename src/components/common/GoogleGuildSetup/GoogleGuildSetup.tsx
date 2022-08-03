import {
  Flex,
  GridItem,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useClipboard,
  useDisclosure,
  usePrevious,
  Wrap,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useCreateGuild from "components/create-guild/hooks/useCreateGuild"
import useGuild from "components/[guild]/hooks/useGuild"
import { AnimatePresence } from "framer-motion"
import { CopySimple } from "phosphor-react"
import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import AddCard from "../AddCard"
import Card from "../Card"
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

  const {
    isOpen: isHelpModalOpen,
    onClose: onHeloModalClose,
    onOpen: onHeloModalOpen,
  } = useDisclosure()

  const prevFilteredGoogleGateables = usePrevious(filteredGoogleGateables)
  useEffect(() => {
    if (filteredGoogleGateables?.length > prevFilteredGoogleGateables?.length) {
      onHeloModalClose()
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

  const guildGoogleEmailAddress = "guild-xyz@guildxyz.iam.gserviceaccount.com"

  if (isGoogleGateablesLoading)
    return (
      <Flex justifyContent="center">
        <Spinner />
      </Flex>
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

            <CardMotionWrapper key={"add-file"}>
              <GridItem>
                <AddCard text="Add file" h={"full"} onClick={onHeloModalOpen} />
              </GridItem>
            </CardMotionWrapper>

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
          </AnimatePresence>
        </SimpleGrid>

        <Modal isOpen={isHelpModalOpen} onClose={onHeloModalClose}>
          <ModalOverlay />
          <ModalContent
            minW={{ base: "auto", md: "2xl" }}
            maxH="xl"
            overflowY={"auto"}
          >
            <ModalHeader>Share your documents with Guild.xyz</ModalHeader>
            <ModalCloseButton />
            <ModalBody as={Stack} spacing="4">
              <HelpPanel />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )

  // if (ready && keyPair && !filteredGoogleGateables?.length)
  return (
    <Card mx="auto" px={{ base: 5, sm: 6 }} py={7} maxW="container.sm">
      <Stack alignItems="start" spacing={4}>
        <HStack spacing={4} alignItems="center">
          {/* {showHelp && (
            <Tooltip label="Back to documents" placement="top">
              <IconButton
                size="sm"
                borderRadius={"full"}
                icon={<ArrowLeft />}
                onClick={() => setShowHelp(false)}
                aria-label="Go back"
              />
            </Tooltip>
          )} */}
          <Heading as="h2" fontSize="xl" fontFamily="display">
            Share your documents with Guild.xyz
          </Heading>
        </HStack>
        <HelpPanel />
      </Stack>
    </Card>
  )

  // Temporary removed - we'd need it if we wouldn't force the use of alternative signing keypair
  // return (
  //   <Alert status="info">
  //     <AlertIcon />
  //     <Stack w="full" direction={{ base: "column", md: "row" }} spacing={4}>
  //       <Stack>
  //         <AlertTitle>Permission required</AlertTitle>
  //         <AlertDescription>
  //           <Stack>
  //             <Text>
  //               Please sign a message so we can fetch your Google documents which you
  //               can gate using Guild.xyz.
  //             </Text>

  //             <Text>
  //               Note that you'll need to share the document(s) you'd like to gate
  //               with the <Kbd>guild-xyz@guildxyz.iam.gserviceaccount.com</Kbd> e-mail
  //               address.
  //             </Text>
  //           </Stack>
  //         </AlertDescription>
  //       </Stack>

  //       <Flex alignItems="center" justifyContent="end">
  //         <Button
  //           onClick={() =>
  //             fetchGoogleGateables({
  //               platformName: "GOOGLE",
  //             })
  //           }
  //         >
  //           Sign message
  //         </Button>
  //       </Flex>
  //     </Stack>
  //   </Alert>
  // )
}

const HelpPanel = () => {
  const guildGoogleEmailAddress = "guild-xyz@guildxyz.iam.gserviceaccount.com"
  const { hasCopied, onCopy } = useClipboard(guildGoogleEmailAddress)

  return (
    <>
      <Wrap>
        <Text as="span">
          Choose what individual document or folder the new role can access in your
          Google Workspace. Invite{" "}
          {
            <Tooltip
              placement="top"
              label={hasCopied ? "Copied" : "Click to copy address"}
              closeOnClick={false}
              hasArrow
            >
              <Button variant="ghost" size="xs" rightIcon={<CopySimple />}>
                {guildGoogleEmailAddress}
              </Button>
            </Tooltip>
          }{" "}
          official guild.xyz email address as an editor to that file within Google
          Drive so guild can manage who can view, comment or edit it automatically
          based on the rules you set in the next steps.
        </Text>
        <Text>We can only manage documents you invite this email address to.</Text>
      </Wrap>
      <Tooltip
        placement="top"
        label={hasCopied ? "Copied" : "Click to copy address"}
        closeOnClick={false}
        hasArrow
      >
        <Button onClick={onCopy} variant="outline" rightIcon={<CopySimple />}>
          <Text fontSize={{ base: "sm", md: "md" }}>{guildGoogleEmailAddress}</Text>
        </Button>
      </Tooltip>
      <video src="/videos/google-config-guide.webm" muted autoPlay loop>
        Your browser does not support the HTML5 video tag.
      </video>
    </>
  )
}

export default GoogleGuildSetup
