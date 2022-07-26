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
import GoogleDocCard from "./components/GoogleDocCard"
import useGoogleGateables from "./hooks/useGoogleGateables"

const GoogleGuildSetup = (): JSX.Element => {
  const {
    response: googleGateables,
    onSubmit: fetchGoogleGateables,
    isLoading,
    isSigning,
  } = useGoogleGateables()

  if (isLoading || isSigning)
    return (
      <Flex justifyContent="center">
        <Spinner />
      </Flex>
    )

  if (googleGateables)
    return (
      <>
        {googleGateables?.length ? (
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3 }}
            spacing={{ base: 4, md: 6 }}
          >
            {googleGateables.map((file) => (
              <GoogleDocCard key={file.platformGuildId} file={file} />
            ))}
          </SimpleGrid>
        ) : (
          <Text as="span">HAMLP NO GATEABLES!</Text>
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
