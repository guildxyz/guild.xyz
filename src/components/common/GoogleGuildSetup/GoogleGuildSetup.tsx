import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  Kbd,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { useFormContext, useWatch } from "react-hook-form"
import GoogleDocCard from "./components/GoogleDocCard"
import useGoogleGateables from "./hooks/useGoogleGateables"

type Props = {
  fieldName: string
  onSelect: (platformGuildId: string, platformGuildName: string) => void
  isLoading?: boolean
  loadingText?: string
  shouldSetName?: boolean
}

const GoogleGuildSetup = ({
  fieldName,
  onSelect,
  isLoading,
  loadingText,
  shouldSetName,
}: Props): JSX.Element => {
  const { guildPlatforms } = useGuild()
  const guildPlatformIds = guildPlatforms?.map((p) => p.platformGuildId) ?? []

  const {
    response: googleGateables,
    onSubmit: fetchGoogleGateables,
    isLoading: isGoogleGateablesLoading,
    isSigning,
  } = useGoogleGateables()

  const filteredGoogleGateables = googleGateables?.filter(
    (file) => !guildPlatformIds.includes(file.platformGuildId)
  )

  const { control, setValue } = useFormContext()
  const platformGuildId = useWatch({ control, name: fieldName })

  if (isGoogleGateablesLoading || isSigning)
    return (
      <Flex justifyContent="center">
        <Spinner />
      </Flex>
    )

  if (filteredGoogleGateables)
    return (
      <>
        {filteredGoogleGateables?.length ? (
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3 }}
            spacing={{ base: 4, md: 6 }}
          >
            {filteredGoogleGateables.map((file) => (
              <GoogleDocCard
                key={file.platformGuildId}
                file={file}
                isLoading={file.platformGuildId === platformGuildId && isLoading}
                loadingText={file.platformGuildId === platformGuildId && loadingText}
                onSelect={(newPlatformGuildId: string) => {
                  onSelect(newPlatformGuildId, file.name)
                  if (shouldSetName) setValue("name", file.name)
                }}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Text as="span">
            We couldn't find any gateable documents. Make sure to share your
            documents with the <Kbd>guild-xyz@guildxyz.iam.gserviceaccount.com</Kbd>{" "}
            e-mail address in order to gate them.
          </Text>
        )}
      </>
    )

  return (
    <Alert status="info">
      <AlertIcon />
      <Stack w="full" direction={{ base: "column", md: "row" }} spacing={4}>
        <Stack>
          <AlertTitle>Permission required</AlertTitle>
          <AlertDescription>
            <Stack>
              <Text>
                Please sign a message so we can fetch your Google documents which you
                can gate using Guild.xyz.
              </Text>

              <Text>
                Note that you'll need to share the document(s) you'd like to gate
                with the <Kbd>guild-xyz@guildxyz.iam.gserviceaccount.com</Kbd> e-mail
                address.
              </Text>
            </Stack>
          </AlertDescription>
        </Stack>

        <Flex alignItems="center" justifyContent="end">
          <Button
            onClick={() =>
              fetchGoogleGateables({
                platformName: "GOOGLE",
              })
            }
          >
            Sign message
          </Button>
        </Flex>
      </Stack>
    </Alert>
  )
}

export default GoogleGuildSetup
