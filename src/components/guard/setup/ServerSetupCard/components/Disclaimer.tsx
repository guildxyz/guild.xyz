import {
  Alert,
  AlertDescription,
  AlertTitle,
  ListItem,
  Stack,
  UnorderedList,
} from "@chakra-ui/react"

const Disclaimer = (): JSX.Element => (
  <Alert colorScheme="gray" py="3">
    <Stack spacing={2}>
      <AlertTitle>Disclaimer</AlertTitle>
      <AlertDescription fontSize="sm" pl="2">
        <UnorderedList>
          <ListItem>Ethereum wallet is required for authentication</ListItem>
          <ListItem>
            You are hiding your members and server from unverified users
          </ListItem>
          <ListItem>
            Guild Guard protects your server from bots, not from humans with
            malicious intent
          </ListItem>
        </UnorderedList>
      </AlertDescription>
    </Stack>
  </Alert>
)

export default Disclaimer
