import { Alert, AlertDescription, AlertIcon, Stack } from "@chakra-ui/react"

const ConnectWalletAlert = () => (
  <Alert status="error" mb="6" pb="5">
    <AlertIcon />
    <Stack>
      <AlertDescription position="relative" top={1} fontWeight="semibold">
        Please connect your wallet in order to continue!
      </AlertDescription>
    </Stack>
  </Alert>
)

export default ConnectWalletAlert
