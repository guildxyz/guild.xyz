import { Alert, AlertDescription, AlertIcon, Stack } from "@chakra-ui/react"

const ConnectWalletAlert = () => {
  return (
    <Alert status="error" mb="6">
      <AlertIcon />
      <Stack>
        <AlertDescription position="relative" top={1}>
          Please connect your wallet in order to continue!
        </AlertDescription>
      </Stack>
    </Alert>
  )
}

export default ConnectWalletAlert
