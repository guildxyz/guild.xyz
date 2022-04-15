import { Alert, AlertDescription, AlertIcon, Stack } from "@chakra-ui/react"

type Props = {
  label: string
}

const ErrorAlert = ({ label }: Props) => (
  <Alert status="error" mb="6" pb="5">
    <AlertIcon />
    <Stack>
      <AlertDescription position="relative" top={1} fontWeight="semibold">
        {label}
      </AlertDescription>
    </Stack>
  </Alert>
)

export default ErrorAlert
