import {
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useCreateGuild from "components/create-guild/hooks/useCreateGuild"
import useGuild from "components/[guild]/hooks/useGuild"
import { AnimatePresence, AnimateSharedLayout } from "framer-motion"
import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
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

  const { control, setValue, reset } = useFormContext()
  const platformGuildId = useWatch({ control, name: fieldName })

  const guildGoogleEmailAddress = "guild-xyz@guildxyz.iam.gserviceaccount.com"
  const { hasCopied, onCopy } = useClipboard(guildGoogleEmailAddress)

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
      <Flex justifyContent="center">
        <Spinner />
      </Flex>
    )

  if (filteredGoogleGateables?.length)
    return (
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
        <AnimateSharedLayout>
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
        </AnimateSharedLayout>
      </SimpleGrid>
    )

  // if (ready && keyPair && !filteredGoogleGateables?.length)
  return (
    <Card mx="auto" px={{ base: 5, sm: 6 }} py={7} maxW="container.sm">
      <Stack alignItems="start" spacing={4}>
        <Heading as="h2" fontSize="xl" fontFamily="display">
          Share your documents with Guild.xyz
        </Heading>
        <Text>
          We couldn't find any gateable documents. Please share your documents with
          the e-mail address below.
        </Text>
        <Tooltip
          placement="top"
          label={hasCopied ? "Copied" : "Click to copy address"}
          closeOnClick={false}
          hasArrow
        >
          <Button onClick={onCopy} variant="unstyled" height="auto">
            {guildGoogleEmailAddress}
          </Button>
        </Tooltip>
        <video src="/videos/google-config-guide.webm" muted autoPlay loop>
          Your browser does not support the HTML5 video tag.
        </video>
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

export default GoogleGuildSetup
